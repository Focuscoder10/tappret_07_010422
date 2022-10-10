/**
 * importation bibliothèque express
 */
const express = require('express');

/**
 * création du router
 */
const router = express.Router();

/**
 * importation du controller "utilisateur"
 */
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

/**
 * création routes d'enregistrement et d'authentification
 */
router.put('/me', auth, multer, userCtrl.me);

/**
 * retourner le router
 */
module.exports = router;
