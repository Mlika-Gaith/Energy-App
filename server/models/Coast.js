const mongoose = require("mongoose");
// * timestamps adds default fields created at and updated at
const CoastSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      unique: false,
    },
    meterID: {
      type: String,
      required: true,
      unique: false,
    },
    time: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);
// * export your DB schema
module.exports = mongoose.model("Coast", CoastSchema);
