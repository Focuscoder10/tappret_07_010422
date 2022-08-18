const db = require("../db");
/**
 * middleware d'authentification
 */
module.exports = userId => {
  try {
    const [users] = db.execute(
      `
  SELECT r.is_moderator
  FROM users u
  JOIN roles r
  ON r.id = u.role_id
  WHERE u.id = ?
  `,
      [userId]
    );
    if (!users.length) return false;
    const user = users[0]
    if(user.is_moderator !== 1) return false;
    return true;
  } catch (e) {
    return false;
  }
};
