const router = require('express').Router();
const Meter = require('../models/Meter');
const Measure = require('../models/Measure');
const Coast = require('../models/Coast');

// adding a meter
router.post('/meter', async (req, res) => {
  const newMeter = new Meter(req.body);
  try {
    const savedMeter = await newMeter.save();
    res.status(200).json(savedMeter);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find meter by id

router.get('/meter/:id', async (req, res) => {
  try {
    const meter = await Meter.find({ID: req.params.id});
    res.status(200).json(meter);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all meters
router.get('/', async (req, res) => {
  try {
    let meters = await Meter.find();
    res.status(200).json(meters);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete meter, its measures and coasts
router.post('/delete/:id', async (req, res) => {
  try {
    const meter = await Meter.deleteMany({ID: req.params.id});
    const measure = await Measure.deleteMany({meterID: req.params.id});
    const coast = await Coast.deleteMany({meterID: req.params.id});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
