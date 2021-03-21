const mongoose = require("mongoose");
const Joi = require("joi");
const router = require("express").Router();

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

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let customer = await new Customer({
    name: req.body.name,
    phone: parseInt(req.body.phone),
    isGold: req.body.isGold,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:name", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findOneAndUpdate(
    { name: req.body.name },
    {
      $set: {
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    },
    { new: true }
  );
  res.send(customer);
});

router.delete("/:name", async (req, res) => {
  const customer = await Customer.findOneAndDelete({ name: req.params.name });
  res.send(customer);
});

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

module.exports = router;
