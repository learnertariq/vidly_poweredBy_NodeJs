const router = require("express").Router();
const { Genre, validate } = require('../models/genre');

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", (req, res) => {
  async function getGenre() {
    const genre = await Genre.findOne({ id: parseInt(req.params.id) });
    if (!genre) return res.status(404).send("404 not found");
    res.send(genre);
  }

  getGenre();
});

router.post("/", (req, res) => {
  const { error } = validate(req.body);
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

router.put("/:id", (req, res) => {
  const { error } = validate(req.body);
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

router.delete("/:id", (req, res) => {
  async function removeGenre() {
    const genre = await Genre.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!genre) return res.status(404).send("404 not found");
    res.send(genre);
  }
  removeGenre();
});

module.exports = router;
