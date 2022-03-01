const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let historySchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "history",
  }
);
module.exports = mongoose.model("History", historySchema);
