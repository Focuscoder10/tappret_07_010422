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
const Comment = require("./comment")(sequelize);
Post.hasMany(Comment);
Comment.belongsTo(Post);
User.hasMany(Post);
Post.belongsTo(User);
User.belongsToMany(Post, { through: "likes" });
Post.belongsToMany(User, { through: "likes" });

module.exports = {
  Sequelize,
  sequelize,
  Post,
  User,
  Comment
};
