const db = require("../db");

exports.create = async (req, res) => {
  if (!req.body.title || !req.body.content) return res.status(400).json({ error: "Bad Request" });
  try {
    const [result] = await db.execute("INSERT INTO topics (forum_id) VALUES(?)", [
      req.body.forum_id,
    ]);
    await db.execute("INSERT INTO posts (title,content,author_id,topic_id) VALUES(?,?,?,?)", [
      req.body.title,
      req.body.content,
      req.auth.userId,
      result.insertId,
    ]);
    res.status(201).json({ message: "Topic Created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const [topics] = await db.execute(
      `SELECT * FROM topics t
      JOIN posts p ON p.topic_id = t.id
      WHERE t.forum_id = ?
      GROUP BY t.id
      ORDER BY p.created_at`,
      [req.params.id]
    );
    res.status(200).json(topics);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get = async (req, res) => {
  try {
    const [topics] = await db.execute(
      `SELECT * FROM topics t
      JOIN posts p ON p.topic_id = t.id
      WHERE t.id = ?
      GROUP BY t.id
      ORDER BY p.created_at`,
      [req.params.id]
    );
    if (!topics.length) return res.status(404).json({ error: "Topic Not Found" });
    res.status(200).json(topics[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.execute("DELETE FROM posts WHERE topic_id = ?", [req.params.id]);
    const [result] = await db.execute("DELETE FROM topics WHERE id = ? LIMIT 1", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Topic Not Found" });
    res.status(200).json({ message: "Topic Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
