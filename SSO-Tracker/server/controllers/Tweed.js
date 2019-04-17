const models = require('../models');

const Tweed = models.Tweed;

const redisUtil = require('../redis.js');


const makerPage = (req, res) => {
  Tweed.TweedModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), tweeds: docs });
  });
};



module.exports.makerPage = makerPage;
