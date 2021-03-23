const winston = require("winston");

module.exports = (err, req, res, next) => {
  // winston.log('error', err.message);

  winston.error(err.message, { metadata: err.stack });
  // executes sequentially
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed..." + err);
};
