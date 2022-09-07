const fs = require("fs");
const path = require("path");
const { Post, User, Comment, sequelize } = require("../models");

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
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM likes WHERE postId = post.id)`
            ),
            "likes",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM comments WHERE postId = post.id)`
            ),
            "commentsCount",
          ],
          [
            sequelize.literal(
              `EXISTS(SELECT * FROM likes WHERE postId = post.id AND userId = $1)`
            ),
            "isLiked",
          ],
        ],
      },
      bind: [req.auth.user.id],
    });
    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [User, { model: Comment, include: [User] }],
      order: [[Comment, "createdAt", "DESC"]],
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM likes WHERE postId = post.id)`
            ),
            "likes",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM comments WHERE postId = post.id)`
            ),
            "commentsCount",
          ],

          [
            sequelize.literal(
              `EXISTS(SELECT * FROM likes WHERE postId = post.id AND userId = $1)`
            ),
            "isLiked",
          ],
        ],
      },
      bind: [req.auth.user.id],
    });
    if (!post) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modify = async (req, res) => {
  console.log(req.body);
  if (!req.body.title || !req.body.content)
    return res.status(400).json({ error: "Bad Request" });
  try {
    const post = {
      title: req.body.title,
      content: req.body.content,
    };
    if (req.file) post.media = req.file.filename;
    const array = await Post.update(post, { where: { id: req.params.id } });
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
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post Not Found" });
    if (!req.auth.user.isModerator && req.auth.user.id !== post.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await post.destroy();
    fs.unlinkSync(path.join(__dirname, "..", "upload", post.media));
    res.status(200).json({ message: "Post Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.like = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post Not Found" });
    if (req.body.isLiked) {
      await post.addLikers(req.auth.user.id);
      res.status(200).json({ message: "Post Liked" });
    } else {
      await post.removeLikers(req.auth.user.id);
      res.status(200).json({ message: "Post Unliked" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
