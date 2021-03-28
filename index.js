const express = require("express");
const app = express();

require("./startup/logging")(app);
require("./startup/middleware")(app);
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`The app is listening to port ${port}`)
);

module.exports = server;
