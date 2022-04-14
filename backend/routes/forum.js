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
const forumCtrl = require("../controllers/forum");
const topicCtrl = require("../controllers/topic");
const auth = require("../middleware/auth");

/**
 * création routes d'enregistrement et d'authentification
 */
router.post("/", auth, forumCtrl.create);
router.get("/", auth, forumCtrl.list);
router.get("/:id", auth, forumCtrl.get);
router.put("/:id", auth, forumCtrl.modify);
router.delete("/:id", auth, forumCtrl.delete);
router.get("/:id/topics", auth, topicCtrl.list);

/**
 * retourner le router
 */
module.exports = router;
