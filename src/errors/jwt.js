module.exports = app => {
  app.use( (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({
          error: true,
          code: 401,
          message: "Unauthorized JWT",
          error_system: {
            message: err.message
          },
          date: new Date()
      });
    }
  });
};
