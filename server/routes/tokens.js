const router = require('express').Router();
const Token = require('../models/Token');

// adding a token
router.post('/token', async (req, res) => {
  try {
    let newToken = new Token(req.body);
    const foundToken = await Token.find({
      token: req.body.token,
    });
    if (foundToken.length == 0) {
      await newToken.save();
      res.status(200).json('New Token Saved');
    } else {
      res.status(200).json('token already registered');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
