/**
 * importations bibliothèques et fichier configuration
 */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('./middleware/cors');
const { errorHandler, initUploadFolder } = require('./common');
const { sequelize } = require('./models');

const app = express();

sequelize
  .sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log(`Failed to sync db: ${err.message}`);
    process.exit(1);
  });

/**
 * importations des routes requises
 */
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

/**
 * middleware de sécurité
 */
app.use(helmet());

/**
 * middleware accès req.body
 */
app.use(express.json());

/**
 * Middleware d'authorisation des requêtes pour tout le monde(CORS)
 */
app.use(cors);

/**
 * définie les routers associés aux différents endpoint
 */
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

(async () => {
  app.use(
    '/upload',
    helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),
    express.static(await initUploadFolder())
  );
})();

// Gestionnaire d'erreur, doit être en dernier
app.use(errorHandler);

/**
 * exporte l'application express
 */
module.exports = app;
