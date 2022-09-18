const mongoose = require('mongoose');
// * timestamps adds default fields created at and updated at
const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {timestamps: true},
);
// * export your DB schema
module.exports = mongoose.model('Token', TokenSchema);
