const Sequelize = require("sequelize");
const crypto = require("crypto");

const User = SequelizeInstance.define("user", {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    classMethods: {
        generateSalt: () => crypto.randomBytes(16).toString("hex"),
        generatePasswordWithSalt: (password, salt) => crypto.pbkdf2Sync(password, salt, 1000, 64, "sha1").toString("hex"),
        validPassword: (password, user) => {
            const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, "sha1").toString("hex");
            return user.password === hash;
        },
    },
    freezeTableName: true, // Model tableName will be the same as the model name
});

// User.sync({ force: true });
User.sync();

module.exports = User;
