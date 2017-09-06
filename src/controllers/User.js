const UserModel = require("../models/userSchema");

class User {
    static createUser(req, res) {
        const {
            password,
            email,
            name,
        } = req.body;

        const salt = UserModel.generateSalt();
        const passwordWithSaltComplete = UserModel.generatePasswordWithSalt(password, salt);

        UserModel.create({
            email,
            name,
            salt,
            password: passwordWithSaltComplete,
        }).then(() => {
            res.status(201).json({
                error: false,
                code: 201,
                message: "User created",
                error_system: null,
                date: new Date(),
            });
        })
            .catch((err) => {
                console.error(err);
                log.error("Error in create a user");

                res.status(400).json({
                    error: true,
                    code: 400,
                    message: "Error in create user",
                    error_system: err.action ? err.action : err.errors,
                    date: new Date(),
                });
            });
    }
}

module.exports = User;
