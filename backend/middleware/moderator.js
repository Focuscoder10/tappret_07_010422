const db = require("../db");
/**
 * middleware d'authentification
 */
module.exports = async userId => {
  try {
    const [users] = await db.execute(
      `
  SELECT is_moderator
  FROM users
  WHERE id = ?
  LIMIT 1
  `,
      [userId]
    );
    if (!users.length) return false;
    return !!users[0].is_moderator;
  } catch (e) {
    return false;
  }
};
