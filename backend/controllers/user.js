/**
 * importation bibliothèques
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const db = require("../db");
const env = require("../env");
const isModerator = require("../middleware/moderator")
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
  /**
   * condition si email non validé retourne erreur 400
   */
  if (!regexEmail.test(req.body.email))
    return res.status(400).json({ error: "Invalid Email Address" });

  /**
   * valide le mot de passe en affichant les détails.
   * retourne un tableau d'erreur sinon vide = true
   * tableau vide = mot de passe valide
   */
  const details = passValidator.validate(req.body.password, { details: true });
  if (details.length)
    return res
      .status(400)
      .json({ error: `Invalid Password: ${details[0].message}` });

  try {
    /**
     * hash du mot de passe
     */
    const hash = await bcrypt.hash(req.body.password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (firstname,lastname,email,password) VALUES (?,?,?,?)",
      [req.body.firstname, req.body.lastname, req.body.email, hash]
    );
    if (!result.affectedRows) throw new Error("No Affected Row");
    res.status(201).json({ message: "User created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * function connection
 */
exports.login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ error: "Bad Request" });
  try {
    let [user] = await db.execute(
      "SELECT id,firstname,lastname,email,password,avatar FROM users WHERE email = ? LIMIT 1",
      [req.body.email]
    );
    if (!user.length) return res.status(401).json({ error: "Unauthorized" });
    else user = user[0];
    const valid = await bcrypt.compare(req.body.password, user.password);
    delete user.password;
    if (!valid) return res.status(401).json({ error: "Unauthorized" });
    await db.execute("UPDATE users SET last_logged_in = ? WHERE id = ?", [
      new Date(),
      user.id,
    ]);
    res.status(200).json({
      token: jwt.sign({ user }, env.secret, { expiresIn: "24h" }),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.list = async (req, res) => {
//   try {
//     const [users] = await db.query(
//       "SELECT id,firstname,lastname,created_at,last_logged_in,email,role_id FROM users"
//     );
//     res.status(200).json(users);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.get = async (req, res) => {
//   try {
//     const [users] = await db.execute(
//       `SELECT
//         id,
//         firstname,
//         lastname,
//         created_at,
//         last_logged_in,
//         email,
//         role_id
//       FROM users
//       WHERE id = ? LIMIT 1`,
//       [req.params.id]
//     );
//     if (!users.length) return res.status(404).json({ error: "User Not Found" });
//     res.status(200).json(users[0]);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


exports.modify = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.email)
    return res.status(400).json({ error: "Bad Request" });
  try {
    const array = [req.body.firstname, req.body.lastname, req.body.email];
    let query = "UPDATE users SET firstname = ?, lastname = ?, email = ?";

    /**
     * verification de la présence d'un mot de passe dans le body
     * si vrai verification de la complexitée et hashage
     * puis on l'ajoute à la requête
     */
    if (Object.hasOwn(req.body, "password") && req.body.password.length > 0) {
      let hash;
      const details = passValidator.validate(req.body.password, {
        details: true,
      });
      if (details.length)
        return res
          .status(400)
          .json({ error: `Invalid Password: ${details[0].message}` });
      try {
        hash = await bcrypt.hash(req.body.password, 10);
      } catch (e) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      query += ", password = ?";
      array.push(hash);
    }
    // "SELECT id,firstname,lastname,email,password,avatar FROM users WHERE email = ? LIMIT 1",

    /**
     * Verification de la présence d'un fichier dans la requête
     * si vrai on ajoute à notre requête
     */
    if (req.file) {
      query += ", avatar = ?";
      array.push(req.file.filename);
    }
    query += " WHERE id = ? LIMIT 1";
    array.push(req.auth.userId);
    const [result] = await db.execute(query, array);
    if (!result.affectedRows) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: "User Not Found" });
    }
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      id: req.auth.userId,
      avatar: req.file.filename,

    }
    res.status(200).json({
      token: jwt.sign({ user }, env.secret, { expiresIn: "24h" }),
    });
  } catch (e) {
    console.error(e);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM users WHERE id = ? LIMIT 1",
      [req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "User Not Found" });
    res.status(200).json({ message: "User Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
