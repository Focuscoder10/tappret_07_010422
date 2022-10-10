const jwt = require('jsonwebtoken');
const { asyncWrapper, HttpError, regex } = require('../common');

/**
 * middleware d'authentification
 */
module.exports = asyncWrapper((req, res, next) => {
  try {
    // Vérifie la présence d'un token dans la requête
    const match = req.headers.authorization.match(regex.bearer);
    if (!match) throw new HttpError({ status: 400, message: 'Invalid Bearer Token' });
    // Vérifie que le token a bien été signé avec la clé secrète
    req.auth = { user: jwt.verify(match[1], process.env.JWT_SECRET) };
    // On passe au middleware suivant
    next();
  } catch (e) {
    // Sinon on lève une exception
    throw e instanceof HttpError ? e : new HttpError(401);
  }
});
