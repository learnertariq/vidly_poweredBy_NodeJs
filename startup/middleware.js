const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  // production middlewares
  app.use(helmet());
  app.use(compression());
};
