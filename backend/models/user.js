const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DataTypes } = require("sequelize");
module.exports = sequelize => {
  const User = sequelize.define(
    "user",
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(password) {
          const hash = bcrypt.hashSync(password, 10);
          this.setDataValue("password", hash);
        },
      },
      avatar: DataTypes.STRING,
      isModerator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "isModerator"],
        },
      },
      scopes: {
        admin: {},
      },
    }
  );

  /**
   *
   * @param String password
   * @returns Boolean password is valid
   */
  User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  /**
   *
   * @returns String token
   */
  User.prototype.createToken = function () {
    const payload = {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      avatar: this.avatar,
      isModerator: this.isModerator
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  };

  return User;
};
