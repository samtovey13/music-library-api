const { Song, Album, Artist } = require('../models');

exports.createSong = (req, res) => {
  const albumId = parseInt(req.params.albumId);
  const artistId = req.body.artist;

  Album.findByPk(albumId).then(album => {
    if (!album) {
      res.status(404).json({ error: "The album could not be found." })
    } else {
      Song.create(req.body)
        .then(song => song.setAlbum(albumId))
        .then(song => song.setArtist(artistId))
        .then(song => {res.status(201).json(song)});
    }
  })

};
