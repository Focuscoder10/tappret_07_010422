/**
 * importation de la bibliothèque jsonwebtoken
 */
const jwt = require("jsonwebtoken");
const bearer = /^Bearer ([\w\.-]+)$/;

/**
 * middleware d'authentification
 */
module.exports = (req, res, next) => {
  try {
    /**
     * vérifie la présence d'un headers authentification
     * vérifie si il est splitable
     */
    const match = req.headers.authorization.match(bearer);
    if (!match) throw new Error("Invalid Bearer Token");

    /**
     * vérifie que le token est bien décriptable avec la clé secrète
     */
    req.auth = { user: jwt.verify(match[1], process.env.JWT_SECRET) };

    /**
     * vérifie que l'userId du body correspond à l'userId du token
     */
    // if (req.body.user.id && req.body.userId !== userId)
    //   throw new Error("Invalid User ID");

    /**
     * si tout est ok passe au middleware suivant
     */
    next();

    /**
     * sinon retourne erreur 401
     */
  } catch (e) {
    console.error(e);
    res
      .status(401)
      .json({ error: e.name === "Error" ? e.message : "Unauthorized" });
  }
};
