// _id: 24 characters

// 12 bytes
// 4 bytes: timestamp
// 3 bytes: machine identifier
// 2 bytes: process identifier
// 3 bytes: counter

// 1 bytes = 8 bits
// 2 ^ 8 = 256
// 2 ^ 24 = 16M

// MongoDB_Driver  ---(generates Id)>>>  MongoDB
// Mongoose --> Driver --> MongoDB
const mongoose = require("mongoose");

const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp());

const isValid = mongoose.Types.ObjectId.isValid("1234");
console.log(isValid);
