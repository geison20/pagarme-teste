module.exports = {
    auth: (req, res, next) => {
        req.checkBody("email", "is required").notEmpty().isEmail().withMessage("e-mail invalid");
        req.checkBody("password", "is required").notEmpty();

        req.getValidationResult().then((errors) => {
            if (errors.isEmpty()) {
                next();
            } else {
                return res.status(400).json({
                    error: true,
                    date: new Date(),
                    code: 400,
                    message: "Validation error",
                    error_system: {
                        error: true,
                        action: errors.array(),
                    },
                });
            }
        });
    },
};
