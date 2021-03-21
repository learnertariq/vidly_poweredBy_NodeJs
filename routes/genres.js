const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const router = express.Router();

const genreSchema = new Schema({
  id: Number,
  name: {
    type: String,
    enum: ["Action", "Horror", "Tragedy", "Comedy"],
    minlength: 3,
    required: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/:id", (req, res) => {
  async function getGenre() {
    const genre = await Genre.findOne({ id: parseInt(req.params.id) });
    if (!genre) return res.status(404).send("404 not found");
    res.send(genre);
  }

  getGenre();
});

/////// Post
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(404).send(`${error.details[0].message}`);

  async function createGenre() {
    const genres = await Genre.find();
    const genre = await new Genre({
      id: genres.length + 1,
      name: req.body.name,
    });

    const result = await genre.save();
    res.send(result);
  }

  createGenre();
});

/////////////// Put
router.put("/:id", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(404).send(`${error.details[0].message}`);

  async function updateGenre() {
    const genre = await Genre.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );
    if (!genre) return res.status(404).send("404 not found");

    res.send(genre);
  }

  updateGenre();
});

//////////// Delete
router.delete("/:id", (req, res) => {
  async function removeGenre() {
    const genre = await Genre.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!genre) return res.status(404).send("404 not found");
    res.send(genre);
  }
  removeGenre();
});

//////////// Joi validator
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = router;
