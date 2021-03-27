const router = require("express").Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleWares/auth");
const admin = require("../middleWares/admin");
const mongoose = require("mongoose");
const validateObjectId = require("../middleWares/validateObjectId");

// const asyncMiddleWare = require("../middleWares/async");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("404 not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(`${error.details[0].message}`);

  const genre = new Genre({
    name: req.body.name,
  });

  const result = await genre.save();
  res.send(result);
});
////////////////////////////////////////////////////////////////

router.put("/:id", [validateObjectId, auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(`${error.details[0].message}`);
  
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true }
    );
    if (!genre) return res.status(404).send("404 not found");
    
    res.send(genre);
    //////////////////////////////////////////////////////////////////
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send("404 not found");
    res.send(genre);
});

module.exports = router;
