const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
module.exports = mongoose.model("User", userSchema);
