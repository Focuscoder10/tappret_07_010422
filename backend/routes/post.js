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
 const postCtrl = require("../controllers/post");
 const auth = require("../middleware/auth");

 /**
  * création routes d'enregistrement et d'authentification
  */
 router.post("/", auth, postCtrl.create);
 router.get("/", auth, postCtrl.list);
 router.get("/:id", auth, postCtrl.get);
 router.put("/:id", auth, postCtrl.modify);
 router.delete("/:id", auth, postCtrl.delete);
//  router.get("/:id/viewed")
  // * retourner le router
  // */
 module.exports = router;