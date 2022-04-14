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
const topicCtrl = require("../controllers/topic");
const auth = require("../middleware/auth");

/**
 * création routes d'enregistrement et d'authentification
 */
router.post("/", auth, topicCtrl.create);
router.get("/:id", topicCtrl.get);
router.delete("/:id", topicCtrl.delete);
//  router.put("/:id", forumCtrl.modify);
//  router.get("/", forumCtrl.list);
/**
 * retourner le router
 */
module.exports = router;
