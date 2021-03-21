//Modules
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const config = require("config");
const express = require("express");
//Routers Path
const home = require("./routes/home");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
//Middlewares Path
const log = require("./middleWares/logger");

//The Express App
const app = express();

mongoose
  .connect("mongodb://localhost:27017/genre_exercises", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.error("Couldn't connect to MongoDb..."));

//Setting up environment variables
// console.log(`node env: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

//Setting configuration
console.log(config.get("name"));
console.log(config.get("host.password"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
//Logging
if (app.get("env") === "development") {
  app.use(log);
  app.use(morgan("tiny"));
  startupDebugger("StartUp debugging....");
  dbDebugger("Database debugging....");
}

//Routers
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

//PORT Listener
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The app is listening to port ${port}`));
