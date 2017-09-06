const UserController = require("../controllers/User");
const UserValidations = require("../middlewares/user");

module.exports = (app) => {
    // create a user
    app.post(`/api/${process.env.API_VERSION}/user/create`, [UserValidations.create], UserController.createUser);
};
