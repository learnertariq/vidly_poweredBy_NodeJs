const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const rentalSchema = new Schema({
  customer: new Schema({
    name: String,
    phone: Number,
  }),
  movie: new Schema({
    title: String,
    dailyRentalRate: {
      type: Number,
      // required: true,
      min: 0,
      max: 255,
    },
  }),
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateMovie(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateMovie;
