const fs = require("fs");
const { Post, User } = require("../models");

exports.create = async (req, res) => {
  if (!req.body.title || !req.body.content)
    return res.status(400).json({ error: "Bad Request" });
  try {
    await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.auth.user.id,
      media: req.file ? req.file.filename : null,
    });
    res.status(201).json({ message: "Post Created" });
  } catch (e) {
    console.error(e);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [User],
    });
    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, { include: ["comments"] });
    if (!post) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modify = async (req, res) => {
  if (!req.body.title || !req.body.content)
    return res.status(400).json({ error: "Bad Request" });
  try {
    const array = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );
    console.log(array);
    if (!array.length) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json({ message: "Post Modified" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const array = await Post.destroy({ where: { id: req.params.id } });
    if (!array.length) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json({ message: "Post Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.like = async (req, res) => {
  try {
    if (req.body.isLiked) {
      await db.execute(
        `
        INSERT INTO likes
        (post_id,user_id)
        VALUES
        (?,?)
      `,
        [req.params.id, req.auth.user.id]
      );
      res.status(200).json({ message: "Post Liked" });
    } else {
      await db.execute(
        `DELETE FROM likes
         WHERE post_id = ? AND user_id = ?
         LIMIT 1`,
        [req.params.id, req.auth.user.id]
      );
      res.status(200).json({ message: "Post Unliked" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
