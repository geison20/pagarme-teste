module.exports = app => {
  const UserController = require("../controllers/User");
  const UserValidations = require("../middlewares/user");

  // create a user
  app.post(`/api/${process.env.API_VERSION}/user/create`, [UserValidations.create], UserController.createUser);

};
