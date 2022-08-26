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
const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

/**
 * création routes d'enregistrement et d'authentification
 */
router.post("/", auth, multer, postCtrl.create);
router.get("/", auth, postCtrl.list);
router.get("/:id", auth, postCtrl.get);
router.put("/:id", auth, postCtrl.modify);
router.delete("/:id", auth, postCtrl.delete);
router.post("/:id/like", auth, postCtrl.like);
router.post("/:id/comments", auth, commentCtrl.create);
router.get("/:id/comments", auth, commentCtrl.list);

/**
 * retourner le router
 */
module.exports = router;
