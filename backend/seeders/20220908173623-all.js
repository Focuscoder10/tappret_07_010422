"use strict";

const { faker } = require("@faker-js/faker");
faker.setLocale("fr");
const bcrypt = require("bcrypt");

Date.prototype.toDateTime = function () {
  return this.toISOString().slice(0, 19).replace("T", " ");
};

Array.prototype.pick = function () {
  return this[Math.floor(Math.random() * this.length)];
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await (async () => {
      const hash = await bcrypt.hash("password", 10);
      const date = faker.date.past().toDateTime();
      const users = [
        {
          firstname: "Groupomania",
          lastname: "Moderator",
          email: "moderator@groupomania.test",
          password: hash,
          avatar: faker.image.avatar(),
          isModerator: true,
          createdAt: date,
          updatedAt: date,
        },
        {
          firstname: "Groupomania",
          lastname: "User",
          email: "user@groupomania.test",
          password: hash,
          avatar: faker.image.avatar(),
          isModerator: false,
          createdAt: date,
          updatedAt: date,
        },
      ];
      for (let i = 0; i < 98; i++) {
        const firstname = faker.name.firstName();
        const lastname = faker.name.lastName();
        const date = faker.date.past().toDateTime();
        users.push({
          firstname,
          lastname,
          email: faker.internet.email(firstname, lastname).toLowerCase(),
          password: hash,
          avatar: faker.image.avatar(),
          isModerator: Math.random() < 0.1,
          createdAt: date,
          updatedAt: date,
        });
      }
      await queryInterface.bulkInsert("users", users, {});
    })();

    const userIds = (
      await queryInterface.sequelize.query("SELECT id FROM users")
    )[0].map(e => e.id);

    await (async () => {
      const posts = [];
      for (let i = 0; i < 1000; i++) {
        const date = faker.date.past().toDateTime();
        posts.push({
          title: faker.lorem.sentence(),
          content: faker.lorem.text(),
          media: faker.image.image(640, 480, true),
          userId: userIds.pick(),
          createdAt: date,
          updatedAt: date,
        });
      }
      await queryInterface.bulkInsert("posts", posts, {});
    })();

    const postIds = (
      await queryInterface.sequelize.query("SELECT id FROM posts")
    )[0].map(e => e.id);

    await (async () => {
      const comments = [];
      for (let i = 0; i < 10000; i++) {
        const date = faker.date.past().toDateTime();
        comments.push({
          content: faker.lorem.text(),
          userId: userIds.pick(),
          postId: postIds.pick(),
          createdAt: date,
          updatedAt: date,
        });
      }
      await queryInterface.bulkInsert("comments", comments, {});
    })();

    await (async () => {
      const likes = [];
      for (let i = 0; i < 10000; i++) {
        const date = faker.date.past().toDateTime();
        const like = {
          createdAt: date,
          updatedAt: date,
        };
        do {
          like.userId = userIds.pick();
          like.postId = postIds.pick();
        } while (
          likes.some(e => e.userId === like.userId && e.postId === like.postId)
        );
        likes.push(like);
      }
      await queryInterface.bulkInsert("likes", likes, {});
    })();
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("comments", null, {});
    await queryInterface.bulkDelete("likes", null, {});
  },
};
