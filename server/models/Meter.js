const mongoose = require('mongoose');
// * timestamps adds default fields created at and updated at
const MeterSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
      unique: true,
    },
    initial_value: {
      type: Number,
      required: true,
      unique: false,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      unique: false,
    },
    residential: {
      type: String,
      required: false,
      default: '',
    },
    voltage: {
      type: String,
      required: true,
      default: '230V',
    },
    amperage: {
      type: String,
      required: true,
      default: '10-40A',
    },
    frequency: {
      type: String,
      required: false,
      default: '50H',
    },
    measures: {
      type: Array,
      required: false,
    },
  },
  {timestamps: true},
);
// * export your DB schema
module.exports = mongoose.model('Meter', MeterSchema);
