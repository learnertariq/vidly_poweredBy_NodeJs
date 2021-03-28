const router = require("express").Router();
const { Rental } = require("../models/rental");
const auth = require("../middleWares/auth");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const validate = require("../middleWares/validate");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("No rental found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");

  rental.return();

  await rental.save();

  await Movie.increaseStock(rental.movie._id);

  res.status(200).send(rental);
});

function validateReturn(reqObject) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(reqObject);
}

module.exports = router;
