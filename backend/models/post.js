const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define(
    'post',
    {
      title: DataTypes.STRING,
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media: DataTypes.STRING,
    },
    {
      scopes: {
        comments: {
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE postId = post.id)'), 'likes'],
              [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE postId = post.id)'), 'commentsCount'],
              [sequelize.literal('EXISTS(SELECT * FROM likes WHERE postId = post.id AND userId = $1)'), 'isLiked'],
            ],
          },
        },
      },
    }
  );
  return Post;
};
