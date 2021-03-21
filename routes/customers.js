const router = require("express").Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
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
  const { error } = validate(req.body);
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

module.exports = router;
