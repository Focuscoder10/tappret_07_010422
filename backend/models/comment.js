const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Comment;
};
