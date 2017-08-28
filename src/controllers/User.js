const JWToken = require('../util/JsonWebToken');
const UserModel = require("../models/userSchema");

class User {
  createUser (req, res) {
    let password = req.body.password;
    let email = req.body.email;
    let name = req.body.name;
    let salt = UserModel.generateSalt();
    let passwordWithSaltComplete = UserModel.generatePasswordWithSalt(password, salt);

    UserModel.create({
        email,
        name,
        salt,
        password : passwordWithSaltComplete,
    }).then( user => {
      res.status(201).json({
        error: false,
        code: 201,
        message: "User created",
        error_system: null,
        date: new Date(),
      });

      return;
    })
    .catch( err => {
      console.error(err);
      log.error("Error in create a user");

      res.status(400).json({
        error: true,
        code: 400,
        message: "Error in create user",
        error_system: err.action ? err.action : err.errors,
        date: new Date()
      });

      return;
    });
  }
}

module.exports = new User();
