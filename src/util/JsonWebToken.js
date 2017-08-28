const JWToken = require('jsonwebtoken');

class JsonWebToken {
  create (payload, cb, options = { expiresIn: "4h" }) {
    JWToken.sign( payload, process.env.SECRET_JWT, options, (err, token) => {
        if (err) console.log(err);

        cb(token);
    });
  }
}

module.exports = new JsonWebToken();
