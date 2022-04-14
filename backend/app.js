/**
 * importations bibliothèques et fichier configuration
 */
const express = require("express");
const helmet = require("helmet");
const cors = require("./middleware/cors");

const app = express();

/**
 * importations des routes requises
 */
const authRoutes = require("./routes/auth");
const forumRoutes = require("./routes/forum");
const postRoutes = require("./routes/post");
const roleRoutes = require("./routes/role");
const userRoutes = require("./routes/user");
const topicRoutes = require("./routes/topic");

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
app.use("/api/auth", authRoutes);
app.use("/api/forums", forumRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/topics", topicRoutes);
/**
 * exporte l'application express
 */
module.exports = app;
