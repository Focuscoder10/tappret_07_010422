const { DataTypes, Op } = require("sequelize");
module.exports = sequelize => {
  const Comment = sequelize.define(
    "comment",
    {
      title: DataTypes.STRING,
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media: DataTypes.STRING,
    },
    {
      tableName: 'posts',
        where: {
          postId: {
            [Op.neq]: null,
          },
        },
    }
  );

  return Comment;
};
