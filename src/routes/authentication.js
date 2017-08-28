module.exports =  app => {
  const AuthenticationController = require("../controllers/Authentication");
  const AuthenticationValidations = require("../middlewares/authentication");

  // login in system by e-mail and password
  app.post(`/api/${process.env.API_VERSION}/authentication/login`, [AuthenticationValidations.auth], AuthenticationController.login);

};
