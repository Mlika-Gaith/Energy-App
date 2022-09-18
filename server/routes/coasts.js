const router = require('express').Router();
const Coast = require('../models/Coast');

// adding a coast
router.post('/coast', async (req, res) => {
  const newCoast = new Coast({
    value: req.body.coast,
    meterID: req.body.meterID,
    time: req.body.time,
  });
  const foundCoast = await Coast.find({
    meterID: req.body.meterID,
    time: req.body.time,
  });
  if (foundCoast.length != 0) {
    try {
      let updated = await Coast.findOneAndUpdate(
        {time: req.body.time, meterID: req.body.meterID},
        {$set: {value: req.body.coast}},
      );
      res.status(200).json('updated !');
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    try {
      const savedCoast = await newCoast.save();
      res.status(200).json(savedCoast);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});
// find coasts by meter id
router.get('/coast/:id', async (req, res) => {
  try {
    const coasts = await Coast.find({meterID: req.params.id});
    res.status(200).json(coasts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all coasts
router.get('/', async (req, res) => {
  try {
    const coasts = await Coast.find();
    res.status(200).json(coasts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
