const JWToken = require("../util/JsonWebToken");
const UserModel = require("../models/userSchema");

class Authentication {
    static login(req, res) {
        const { email, password } = req.body;

        UserModel.findOne({
            where: { email },
        })
            .then((userByEmail) => {
                if (!userByEmail) { // if not found user
                    throw new Error({
                        error: true,
                        message: "login fail, check email",
                        email,
                    });
                } else if (UserModel.validPassword(password, userByEmail)) { // now valid password
                    const userByEmailJSON = userByEmail.toJSON();

                    delete userByEmailJSON.password;
                    delete userByEmailJSON.salt;
                    delete userByEmailJSON.createdAt;
                    delete userByEmailJSON.updatedAt;

                    JWToken.create(userByEmailJSON, token => res.status(200).json({
                        error: false,
                        code: 200,
                        message: "Login successfull",
                        user: userByEmailJSON,
                        token,
                        date: new Date(),
                    }));
                } else {
                    throw new Error({
                        error: true,
                        message: "login fail, check password",
                        password,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                log.warn("Fail login");

                return res.status(400).json({
                    error: true,
                    status_code: 400,
                    message: err.message ? err.message : "Error in system",
                    error_system: err,
                    date: new Date(),
                });
            });
    }
}

module.exports = Authentication;
