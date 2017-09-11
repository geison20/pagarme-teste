const Sequelize = require("sequelize");

const Pokemon = SequelizeInstance.define("pokemon", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
}, {
    classMethods: {},
    freezeTableName: true, // Model tableName will be the same as the model name
});

if (process.env.ENV === "development") {
  Pokemon.sync({force: true});
} else {
  Pokemon.sync();
}

module.exports = Pokemon;
