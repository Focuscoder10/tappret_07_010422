const db = require("../db");
const fs = require("fs");

exports.create = async (req, res) => {
  if (!req.body.content)
    return res.status(400).json({ error: "Bad Request" });
  try {
    await db.execute(
      `
      INSERT INTO posts
      (content,author_id,parent_id)
      VALUES
      (?,?,?)
    `,
      [
        req.body.content,
        req.auth.userId,
        req.params.id
      ]
    );
    res.status(201).json({ message: "Comment Created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const [comments] = await db.execute(
      `
      SELECT
      p.content,
      p.created_at,
      u.firstname AS author_firstname,
      u.lastname AS author_lastname
      FROM posts p
      JOIN users u 
      ON p.author_id = u.id
      WHERE p.parent_id = ? 
      ORDER BY p.created_at DESC
    `,
      [req.params.id]
    );
    res.status(200).json(comments);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.get = async (req, res) => {
//   try {
//     const [posts] = await db.execute(
//       `
//       SELECT
//       p.*,
//       u.firstname AS author_firstname,
//       u.lastname AS author_lastname,
//       COUNT(l.user_id) AS likes,
//       EXISTS(SELECT * FROM likes l WHERE l.post_id = p.id AND l.user_id = ? LIMIT 1) AS is_liked
//       FROM posts p
//       JOIN users u 
//       ON p.author_id = u.id 
//       LEFT JOIN likes l
//       ON l.post_id = p.id
//       WHERE p.id = ?
//       GROUP BY p.id
      
//     `,
//       [req.auth.userId,req.params.id]
//     );
//     if (!posts.length) return res.status(404).json({ error: "Post Not Found" });
//     res.status(200).json(posts[0]);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.modify = async (req, res) => {
//   if (!req.body.title || !req.body.content)
//     return res.status(400).json({ error: "Bad Request" });
//   try {
//     const [result] = await db.execute(
//       "UPDATE posts SET title = ?, content = ? WHERE id = ? LIMIT 1",
//       [req.body.title, req.body.content, new Date(), req.params.id]
//     );
//     if (!result.affectedRows)
//       return res.status(404).json({ error: "Post Not Found" });
//     res.status(200).json({ message: "Post Modified" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.delete = async (req, res) => {
//   try {
//     const [result] = await db.execute(
//       "DELETE FROM posts WHERE id = ? LIMIT 1",
//       [req.params.id]
//     );
//     if (!result.affectedRows)
//       return res.status(404).json({ error: "Post Not Found" });
//     res.status(200).json({ message: "Post Deleted" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.like = async (req, res) => {
//   // res.status(200).json( req.body );
//   // return;
//   try {
//     if (req.body.isLiked) {
//       await db.execute(
//         `
//         INSERT INTO likes
//         (post_id,user_id)
//         VALUES
//         (?,?)
//       `,
//         [req.params.id, req.auth.userId]
//       );
//       res.status(200).json({ message: "Post Liked" });
//     } else {
//       await db.execute(
//         `DELETE FROM likes
//          WHERE post_id = ? AND user_id = ?
//          LIMIT 1`,
//         [req.params.id, req.auth.userId]
//       );
//       res.status(200).json({ message: "Post Unliked" });
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
