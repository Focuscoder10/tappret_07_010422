const { DataTypes } = require("sequelize");
module.exports = sequelize => {
  const Post = sequelize.define("post", {
    title: DataTypes.STRING,
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media: DataTypes.STRING,
  });
  return Post;
};
