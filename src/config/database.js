const SequelizeModule = require('sequelize');
const opts = {
          dialect: "sqlite",
          storage: "storage/database.sqlite"
      };

const Sequelize = new SequelizeModule(process.env.DB_NAME, null, null, opts);

// define instance global
global.SequelizeInstance = Sequelize;

// exports
module.exports = Sequelize;
