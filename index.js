const express = require("express");
const app = express();

require("./startup/logging")(app);
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/middleware")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The app is listening to port ${port}`));
