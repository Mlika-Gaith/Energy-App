const router = require('express').Router();
const Measure = require('../models/Measure');
const Meter = require('../models/Meter');

// adding a measure
router.post('/measure', async (req, res) => {
  let newMeasure = new Measure(req.body);
  //console.log(req.body.meterID);
  const meter = await Meter.find({ID: req.body.meterID});
  const lastMeasure = await Measure.find({meterID: req.body.meterID})
    .sort({_id: -1})
    .limit(1);
  if (lastMeasure.length == 0 && newMeasure.value >= meter[0].initial_value) {
    try {
      newMeasure.real_value = newMeasure.value - meter[0].initial_value;
      const savedMeasure = await newMeasure.save();
      await Meter.updateMany(
        {ID: req.body.meterID},
        {$push: {measures: savedMeasure}},
      );
      res.status(200).json(savedMeasure);
    } catch (err) {
      console.log(err);
    }
  } else {
    if (lastMeasure.length > 0 && lastMeasure[0].value <= newMeasure.value) {
      newMeasure.real_value = newMeasure.value - lastMeasure[0].value;
      try {
        const savedMeasure = await newMeasure.save();
        await Meter.updateMany(
          {ID: req.body.meterID},
          {$push: {measures: savedMeasure}},
        );
        res.status(200).json(savedMeasure);
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(500).json('bad value');
    }
  }
});

// getting all measures

router.get('/getmeasures', async (req, res) => {
  try {
    const measure = await Measure.find();
    console.log(measure);
    res.status(200).json(measure);
  } catch (err) {
    res.status(500).json(err);
  }
});

// AI Measure
router.post('/aimeasure', async (req, res) => {
  try {
    console.log(req);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
