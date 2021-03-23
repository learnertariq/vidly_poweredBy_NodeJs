const config = require("config");

module.exports = function () {
  // Environment Vairables Availability
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  }

  // Setting up environment variables
  // console.log(`node env: ${process.env.NODE_ENV}`);
  // console.log(`app: ${app.get('env')}`);

  // Setting configuration
  // console.log(config.get("name"));
  // console.log(config.get("host.password"));
};
