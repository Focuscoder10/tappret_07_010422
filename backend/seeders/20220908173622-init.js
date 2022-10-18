/* eslint-disable no-extend-native,func-names */

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

faker.setLocale('fr');

Date.prototype.toDateTime = function () {
  return this.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = {
  async up(queryInterface) {
    await (async () => {
      const hash = await bcrypt.hash('password', 10);
      const date = faker.date.past().toDateTime();
      const users = [
        {
          firstname: 'Groupomania',
          lastname: 'Moderator',
          email: 'moderator@groupomania.test',
          password: hash,
          avatar: faker.image.avatar(),
          isModerator: true,
          createdAt: date,
          updatedAt: date,
        },
        {
          firstname: 'Groupomania',
          lastname: 'User',
          email: 'user@groupomania.test',
          password: hash,
          avatar: faker.image.avatar(),
          isModerator: false,
          createdAt: date,
          updatedAt: date,
        },
      ];
      await queryInterface.bulkInsert('users', users, {});
    })();
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
