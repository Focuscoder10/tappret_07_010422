const fs = require('fs/promises');
const path = require('path');
const PasswordValidator = require('password-validator');
const { asyncWrapper, HttpError, regex } = require('../common');
const { User } = require('../models');

const passValidator = new PasswordValidator();

/**
 * https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
 * Contraintes sur le mot de passe
 */
passValidator
  .is()
  .min(8)
  .is()
  .max(64)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

/**
 * Valide la complexité du mot de passe.
 * Sinon lève une exception
 * @param {String} password
 */
function checkPassword(password) {
  const details = passValidator.validate(password, {
    details: true,
  });
  if (details.length) {
    throw new HttpError({
      status: 400,
      message: 'Invalid Password',
      details,
    });
  }
}

exports.signup = asyncWrapper(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) throw new HttpError(400);
  if (!regex.email.test(email)) {
    throw new HttpError({ status: 400, message: 'Invalid Email Address' });
  }
  checkPassword(password);
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });
  res.status(201).json({ message: 'User created', user });
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400);
  const user = await User.scope('admin').findOne({ where: { email } });
  if (!user || !user.isValidPassword(password)) throw new HttpError(401);
  user.changed('updatedAt', true);
  await user.save();
  res.status(200).json({ token: user.createToken() });
});

exports.me = asyncWrapper(async (req, res) => {
  const { firstname, lastname, email, password } = JSON.parse(req.body.user);
  const { avatar } = req.auth.user;
  if (!firstname || !lastname || !email) throw new HttpError(400);
  const user = await User.scope('admin').findByPk(req.auth.user.id);
  if (!user) throw new HttpError(404);
  user.set({ firstname, lastname, email });
  if (password) {
    checkPassword(password);
    user.password = password;
  }
  if (req.file) {
    user.avatar = req.file.filename;
    if (avatar && !regex.proto.test(avatar)) {
      await fs.unlink(path.join(__dirname, '..', 'upload', avatar)).catch(() => {});
    }
  }
  await user.save();
  res.status(200).json({
    token: user.createToken(),
  });
});
