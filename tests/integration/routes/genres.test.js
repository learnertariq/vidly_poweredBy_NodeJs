const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return Genres from database", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the Genre if a valid id is passed", async () => {
      const genre = new Genre({
        name: "Action",
      });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const objectId = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${objectId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Comedy";
    });

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "Com";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "Comedy" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Comedy");
    });
  });

  describe("PUT /", () => {
    let objectId;
    let token;
    let name;

    beforeEach(() => {
      objectId = mongoose.Types.ObjectId();
      token = new User().generateAuthToken();
      name = "Comedy";
    });

    const exec = function () {
      return request(server)
        .put("/api/genres/" + objectId)
        .set("x-auth-token", token)
        .send({ name });
    };

    const saveNewGenreAndGet = () => {
      const genre = new Genre({
        name: "Action",
      });
      return genre.save();
    };

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "Com";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if invalid id is passed", async () => {
      objectId = "1";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 200 if valid id is passed", async () => {
      const genre = await saveNewGenreAndGet();

      objectId = genre._id;

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the genre if it is saved in db", async () => {
      const genre = await saveNewGenreAndGet();

      objectId = genre._id;

      const res = await exec();

      const result = await Genre.findById(genre._id);
      expect(res.body).toHaveProperty("name", result.name);
    });
  });

  describe("DELETE /", () => {
    let id;
    let token;
    let genre;

    beforeEach(async () => {
      genre = new Genre({
        name: "Action",
      });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    const exec = function () {
      return request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = "1";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if given id is valid", async () => {
      const res = await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();


      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });

  });
});
