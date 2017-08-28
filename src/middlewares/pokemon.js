module.exports = {
  create: (req, res, next) => {
    req.checkBody('name', 'is required').notEmpty();
    req.checkBody('price', 'is required').notEmpty().isInt().withMessage('parameter must be a interger');

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
  },
  buy: (req, res, next) => {
    req.checkBody('id', 'is required').notEmpty().isInt().withMessage('parameter must be a interger');
    req.checkBody('quantity', 'is required').notEmpty().isInt({min:1}).withMessage('parameter must be a interger');

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
