const { Comment } = require('../models');
const { asyncWrapper, HttpError } = require('../common');

exports.create = asyncWrapper(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new HttpError(400);
  await Comment.create({
    content,
    userId: req.auth.user.id,
    postId: req.params.id,
  });
  return res.status(201).json({ message: 'Comment Created' });
});

exports.delete = asyncWrapper(async (req, res) => {
  const comment = await Comment.findByPk(req.params.commentId);
  if (!comment) throw new HttpError(404);
  if (!req.auth.user.isModerator && req.auth.user.id !== comment.userId) {
    throw new HttpError(401);
  }
  await comment.destroy();
  return res.status(200).json({ message: 'Comment Deleted' });
});
