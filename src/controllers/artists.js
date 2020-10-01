const { Artist } = require('../models');

exports.create = (req, res) => {
  Artist.create(req.body).then(artist => res.status(201).json(artist));
};

exports.list = (req, res) => {
  Artist.findAll().then(artists => res.status(200).json(artists));
};
