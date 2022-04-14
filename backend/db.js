const mysql = require("mysql2");
const env = require("./env");

/**
 * Connexion base de données
 */
const db = mysql.createPool(env.mysql);

/**
 * Si une erreur de connexion survient
 * On affiche une erreur et on quitte le programme
 */
db.on("error", e => {
  console.error("Connection to mysql server failed:", e.code);
  process.exit(1);
});

/**
 * Si la connexion est OK
 */
db.on("connection", () => {
  console.log("Connection to mysql server successful");
});

/**
 * On exporte la connexion
 */
module.exports = db.promise();
