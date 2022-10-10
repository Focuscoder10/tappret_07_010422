const rateLimit = require('express-rate-limit');
const { STATUS_CODES } = require('node:http');

const status = 429;
const message = STATUS_CODES[status];

/**
 * Limite l'enregistrement et la connexion d'un compte
 * 5 tentatives sur une fenêtre de 15 minutes
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status, message },
});

module.exports = limiter;
