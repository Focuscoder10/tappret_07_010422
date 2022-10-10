const fs = require('fs/promises');
const path = require('path');
const { asyncWrapper, HttpError, regex } = require('../common');
const { Post, User, Comment } = require('../models');

async function removeMedia(media) {
  if (media && !regex.proto.test(media)) {
    await fs.unlink(path.join(__dirname, '..', 'upload', media)).catch(() => {});
  }
}

exports.create = asyncWrapper(async (req, res) => {
  const { title, content } = JSON.parse(req.body.post);
  if (!title || !content) throw new HttpError(400);
  await Post.create({
    title,
    content,
    userId: req.auth.user.id,
    media: req.file ? req.file.filename : null,
  });
  res.status(201).json({ message: 'Post Created' });
});

exports.list = asyncWrapper(async (req, res) => {
  const perPage = 5;
  const int = parseInt(req.query.page, 10);
  const page = Number.isNaN(int) || int < 1 ? 1 : int;
  const posts = await Post.scope('comments').findAll({
    include: [User],
    order: [['createdAt', 'DESC']],
    limit: perPage,
    offset: perPage * (page - 1),
    bind: [req.auth.user.id],
  });
  res.status(200).json(posts);
});

exports.get = asyncWrapper(async (req, res) => {
  const post = await Post.scope('comments').findByPk(req.params.id, {
    include: [User, { model: Comment, include: [User] }],
    order: [[Comment, 'createdAt', 'DESC']],
    bind: [req.auth.user.id],
  });
  if (!post) throw new HttpError(404);
  res.status(200).json(post);
});

exports.modify = asyncWrapper(async (req, res) => {
  const { title, content, keepMedia } = JSON.parse(req.body.post);
  if (!title || !content) throw new HttpError(400);
  const post = await Post.findByPk(req.params.id);
  if (!post) throw new HttpError(404);
  if (!req.auth.user.isModerator && req.auth.user.id !== post.userId) {
    throw new HttpError(401);
  }
  const oldMedia = post.media;
  post.set({ title, content });
  if (req.file) post.media = req.file.filename;
  else if (!keepMedia) post.media = null;
  await post.save();
  if (oldMedia !== post.media) await removeMedia(oldMedia);
  res.status(200).json({ message: 'Post Modified' });
});

exports.delete = asyncWrapper(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) throw new HttpError(404);
  if (!req.auth.user.isModerator && req.auth.user.id !== post.userId) {
    throw new HttpError(401);
  }
  await post.destroy();
  await removeMedia(post.media);
  res.status(200).json({ message: 'Post Deleted' });
});

exports.like = asyncWrapper(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) throw new HttpError(404);
  let message;
  if (req.body.isLiked) {
    await post.addLikers(req.auth.user.id);
    message = 'Post Liked';
  } else {
    await post.removeLikers(req.auth.user.id);
    message = 'Post Unliked';
  }
  res.status(200).json({ message });
});
