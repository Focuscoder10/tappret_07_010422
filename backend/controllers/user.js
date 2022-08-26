/**
 * importation bibliothèques
 */
const passwordValidator = require("password-validator");
const { User } = require("../models");
const fs = require("fs");
const path = require("path");
const regexEmail =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const passValidator = new passwordValidator();

/**
 * https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
 * contraintes sur le mot de passe
 */
// prettier-ignore
passValidator
  .is().min(8)
  .is().max(64)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols();

/**
 * function enregistrement
 */
exports.signup = async (req, res) => {
  if (
    !req.body.firstname ||
    !req.body.lastname ||
    !req.body.email ||
    !req.body.password
  )
    return res.status(400).json({ error: "Bad Request" });
  const { firstname, lastname, email, password } = req.body;

  /**
   * condition si email non validé retourne erreur 400
   */
  if (!regexEmail.test(email))
    return res.status(400).json({ error: "Invalid Email Address" });

  /**
   * valide le mot de passe en affichant les détails.
   * retourne un tableau d'erreur sinon vide = true
   * tableau vide = mot de passe valide
   */
  const details = passValidator.validate(password, { details: true });
  if (details.length)
    return res
      .status(400)
      .json({ error: `Invalid Password: ${details[0].message}` });

  try {
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });
    res.status(201).json({ message: "User created", user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * function connexion
 */
exports.login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ error: "Bad Request" });
  const { email, password } = req.body;
  try {
    const user = await User.scope("admin").findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!user.isValidPassword(password))
      return res.status(401).json({ error: "Unauthorized" });
    user.changed("updatedAt", true);
    await user.save();
    res.status(200).json({ token: user.createToken() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.me = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.email)
    return res.status(400).json({ error: "Bad Request" });
  const { firstname, lastname, email, password } = req.body;
  try {
    const user = await User.findByPk(req.auth.user.id);
    if (!user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "User Not Found" });
    }
    user.update({ firstname, lastname, email });

    /**
     * verification de la présence d'un mot de passe dans le body
     * si vrai verification de la complexitée et hashage
     * puis on l'ajoute à la requête
     */
    if (password) {
      const details = passValidator.validate(password, {
        details: true,
      });
      if (details.length)
        return res
          .status(400)
          .json({ error: `Invalid Password: ${details[0].message}` });
      user.password = password;
    }
    // "SELECT id,firstname,lastname,email,password,avatar FROM users WHERE email = ? LIMIT 1",

    /**
     * Verification de la présence d'un fichier dans la requête
     * si vrai on ajoute à notre requête
     */
    if (req.file) user.avatar = req.file.filename;

    // On sauvegarde le modele
    user.save();

    // Si ancien avatar, on le supprime
    if (req.auth.user.avatar && req.file)
      fs.unlinkSync(path.join(__dirname, "..", "upload", req.auth.user.avatar));

    res.status(200).json({
      token: user.createToken(),
    });
  } catch (e) {
    console.error(e);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
