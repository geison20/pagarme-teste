const JWToken = require('../util/JsonWebToken');
const UserModel = require("../models/userSchema");

class Authentication {

  login (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    UserModel.findOne({
      where : { email }
    })
    .then( userByEmail => {

      if (!userByEmail) { // if not found user
        return Promise.reject({
          error : true,
          message : "login fail, check email",
          email
        });
      } else if ( UserModel.validPassword(password, userByEmail) ) { // now valid password
        userByEmail = userByEmail.toJSON();

        delete userByEmail.password;
        delete userByEmail.salt;
        delete userByEmail.createdAt;
        delete userByEmail.updatedAt;

        JWToken.create(userByEmail, token => {
          res.status(200).json({
            error: false,
            code: 200,
            message: "Login successfull",
            user: userByEmail,
            token: token,
            date: new Date()
          });

          return;
        });
      } else {
        return Promise.reject({
          error : true,
          message : "login fail, check password",
          password
        });
      }
    })
    .catch( err => {
      console.log(err);
      log.warn("Fail login");

      res.status(400).json({
        error : true,
        status_code : 400,
        message : err.message ? err.message : "Error in system",
        error_system : err,
        date: new Date(),
      });

      return;
    });
  }
}

module.exports = new Authentication();
