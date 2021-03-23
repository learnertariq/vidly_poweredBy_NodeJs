const router = require("express").Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleWares/auth");
const admin = require("../middleWares/admin");
// const asyncMiddleWare = require("../middleWares/async");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findOne({ id: parseInt(req.params.id) });
  if (!genre) return res.status(404).send("404 not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(`${error.details[0].message}`);

  console.log(req.user);

  const genres = await Genre.find();
  const genre = await new Genre({
    id: genres.length + 1,
    name: req.body.name,
  });

  const result = await genre.save();
  res.send(result);
});

router.put("/:id", auth, (req, res) => {
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

router.delete("/:id", [auth, admin], (req, res) => {
  async function removeGenre() {
    const genre = await Genre.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!genre) return res.status(404).send("404 not found");
    res.send(genre);
  }
  removeGenre();
});

module.exports = router;
