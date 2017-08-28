const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const expressValidator = require("express-validator");
const routesPaths = path.join(__dirname, 'src/routes');
const jwt_express = require('express-jwt');

const app = express();

require('dotenv').config();

require("./src/config/database");

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
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

// server init
app.listen(process.env.PORT, () => console.log(`Api Started in port ${process.env.PORT}`));

module.exports = app;
