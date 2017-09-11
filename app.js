const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const expressValidator = require("express-validator");
const routesPaths = path.join(__dirname, 'src/routes');
const jwt_express = require('express-jwt');
const expressBrute = require('express-brute');
const SequelizeStoreBruteAttack = require('express-brute-sequelize');

let store;

const app = express();

require('dotenv').config();

require("./src/config/database");

global.log = require('simple-node-logger').createSimpleFileLogger('logs/output.log');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.use(expressValidator({
  customValidators: {
    isValidPassword : function (password) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,12}/.test(password);
    }
 }
}));

// load all routes
fs.readdir(routesPaths, (err, filesArr) => {
  if (err) {
    console.log(err);
  }

  filesArr.forEach( file => {
    let routeFileFullPath = path.join(routesPaths, file);

    require(routeFileFullPath)(app);
  });
});

// jwt config
app.use(jwt_express({ secret : process.env.SECRET_JWT }).unless({
    path: [
        `/api/${process.env.API_VERSION}/user/create`,
        `/api/${process.env.API_VERSION}/authentication/login`
      ]
}));

// request errors handle
require("./src/errors/jwt")(app);

// middleware to all routes to prevent brute attacks
if(process.env.ENV ===  "development") {
  store = new expressBrute.MemoryStore(); // stores state locally, don't use this in production
} else {
  new SequelizeStoreBruteAttack(SequelizeInstance, 'bruteStore', {}, (storeSequelize) => {
  	store = new expressBrute(storeSequelize); // store in production
  });
}

const preventBruteForceAttack = new expressBrute(store, {
    freeRetries: 10,
    minWait: 5*60*1000, // 5 minutes
    maxWait: 60*60*1000, // 1 hour,
    failCallback: (req, res, next, nextValidRequestDate) => {
      return res.status(302).json({
        error: true,
        code: 302,
        message: "Many attempts, wait 5 minutes",
        redirect: `/api/${process.env.API_VERSION}/authentication/login`,
        date: new Date()
      });
    },
    handleStoreError: (err) => log.error(err)
});

// use for all routes
app.all("*", preventBruteForceAttack.prevent, (req, res, next) => next());

// server init
app.listen(process.env.PORT, () => console.log(`Api Started in port ${process.env.PORT}`));

module.exports = app;
