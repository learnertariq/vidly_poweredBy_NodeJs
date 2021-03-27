const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morgan = require("morgan");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const config = require("config");

module.exports = function (app) {
  const database = config.get("db");
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.MongoDB({
      db: database,
      level: "info",
    })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.Console({ colorize: true }));
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: database,
      level: "info",
    })
  );

  //Logging
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    startupDebugger("StartUp debugging....");
    dbDebugger("Database debugging....");
  }
};

// handling uncaught exceptions
// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, { metadata: ex.stack });
//   process.exit(1);
// });

// winston.exceptions.handle(
// new winston.transports.File({ filename: "uncaughtExceptions.log" })
// new winston.transports.MongoDB({
//   db: "mongodb://localhost:27017/genre_exercises",
//   level: "info",
// })
// );

// process.on("unhandledRejection", (ex) => {
// winston.error(ex.message, { metadata: ex.stack });
// process.exit(1);
// throw ex;
// });

// Example for throwing unhandled Rejection
// const p = Promise.reject(new Error("unhandled rejection"));
// p.then(() => console.log("Done"));
