const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
  }
);

const User = require("./user")(sequelize);
const Post = require("./post")(sequelize);
// const Like = require("./like")(sequelize);
const Comment = require("./comment")(sequelize);
Post.hasMany(Comment, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
});
Comment.belongsTo(Post);
User.hasMany(Post, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
Post.belongsTo(User);
User.hasMany(Comment, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
});
Comment.belongsTo(User);
User.belongsToMany(Post, { through: "likes", as: "liked" });
Post.belongsToMany(User, { through: "likes", as: "likers" });

module.exports = {
  Sequelize,
  sequelize,
  Post,
  User,
  Comment,
  // Like
};
