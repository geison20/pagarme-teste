module.exports = {
  create: (req, res, next) => {
    req.checkBody('email', 'is required').notEmpty().isEmail().withMessage('e-mail invalid');
    req.checkBody('name', 'is required').notEmpty();
    req.checkBody('password', 'is required').notEmpty().isValidPassword().withMessage('password must to have special characters, upper/lower case letters and numbers.');
    
    req.getValidationResult().then( errors => {
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
            action: errors.array()
          }
        });
      }
    })
  }
};
