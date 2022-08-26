const { Post } = require("../models");
exports.create = async (req, res) => {
  if (!req.body.content) return res.status(400).json({ error: "Bad Request" });
  try {
    await db.execute(
      `
      INSERT INTO posts
      (content,author_id,parent_id)
      VALUES
      (?,?,?)
    `,
      [req.body.content, req.auth.user.id, req.params.id]
    );
    res.status(201).json({ message: "Comment Created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const comments = await Post.scope("comment").findAll({
      where: { postId: req.params.id },
    });
    res.status(200).json(comments);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
