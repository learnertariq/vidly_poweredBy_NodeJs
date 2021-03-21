const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 55,
    required: true,
  },
  phone: {
    type: Number,
    min: 10000,
    max: 9999999999999,
  },
  isGold: Boolean,
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;