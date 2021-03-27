const auth = require("../../../middleWares/auth");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid json web token ", () => {
    const objectId = mongoose.Types.ObjectId().toHexString();
    const user = { _id: objectId, isAdmin: true };
    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
    // expect(req.user).toHaveProperty("_id", objectId);
    // expect(req.user).toHaveProperty("isAdmin", true);
  });
});
