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
 const roleCtrl = require("../controllers/role");
 const auth = require("../middleware/auth");

 /**
  * création routes d'enregistrement et d'authentification
  */
 router.post("/", auth, roleCtrl.create);
 router.get("/", auth, roleCtrl.list);
 router.get("/:id", auth, roleCtrl.get);
 router.put("/:id", auth, roleCtrl.modify);
 router.delete("/:id", auth, roleCtrl.delete);
  // * retourner le router
  // */
 module.exports = router;