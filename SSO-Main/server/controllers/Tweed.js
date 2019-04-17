const models = require('../models');

const Tweed = models.Tweed;

const makerPage = (req, res) => {
  Tweed.TweedModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), tweeds: docs });
  });
};

//create new tweed
const makeTweed = (req, res) => {
  if (!req.body.tweed) {
    return res.status(400).json({ error: 'RAWR! Tweed message is required' });
  }

  const tweedData = {
    name: req.session.account.username,
    tweed: req.body.tweed,
    owner: req.session.account._id,
  };

  const newTweed = new Tweed.TweedModel(tweedData);

  const tweedPromise = newTweed.save();

  tweedPromise.then(() => {

    res.json({ redirect: '/maker' });
  });

  tweedPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  });

  return tweedPromise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeTweed;
