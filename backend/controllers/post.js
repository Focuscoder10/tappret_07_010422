const db = require("../db");

exports.create = async (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.topic_id)
  return res.status(400).json({ error: "Bad Request" });
  try {
    await db.execute("INSERT INTO posts (title,content,author_id,topic_id) VALUES(?,?,?,?)", [
      req.body.title,
      req.body.content,
      req.auth.userId,
      req.body.topic_id,
    ]);
    res.status(201).json({ message: "Post created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const [posts] = await db.query("SELECT * FROM posts");
    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get = async (req, res) => {
  try {
    const [posts] = await db.execute("SELECT * FROM posts WHERE id = ? LIMIT 1", [req.params.id]);
    if (!posts.length) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json(posts[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modify = async (req, res) => {
  if (!req.body.title || !req.body.content)
  return res.status(400).json({ error: "Bad Request" });
  try {
    const [result] = await db.execute(
      "UPDATE posts SET title = ?, content = ? WHERE id = ? LIMIT 1",
      [req.body.title, req.body.content, new Date(), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json({ message: "Post Modified" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM posts WHERE id = ? LIMIT 1", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json({ message: "Post Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
