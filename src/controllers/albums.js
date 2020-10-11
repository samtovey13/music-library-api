const { Album, Artist } = require('../models');

exports.createAlbum = (req, res) => {
  const artist = req.params.artistId
  Artist.findByPk(artist).then(artist => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." })
    } else {
      Album.create(req.body).then(album => {
        const updatedAlbum = album.setArtist(artist);
        return updatedAlbum;
      })
      .then(album => {res.status(201).json(album)})
    }
  })
};
