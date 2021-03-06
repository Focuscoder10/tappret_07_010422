/**
 * importation bibliothèque express
 */
 const express = require("express");

 /**
  * création du router
  */
 const router = express.Router();
 
 /**
  * importation du controller "utilisateur"
  */
 const userCtrl = require("../controllers/user");
 const auth = require("../middleware/auth");

 /**
  * création routes d'enregistrement et d'authentification
  */
 
 router.get("/", auth, userCtrl.list);
 router.get("/:id", auth, userCtrl.get);

  // */
 module.exports = router;