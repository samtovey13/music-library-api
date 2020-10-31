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

exports.getAlbums = (req, res) => {
  Album.findAll().then(albums => res.status(200).json(albums))
};

exports.getAlbumById = (req, res) => {
  const albumId = req.params.albumId;
  Album.findByPk(albumId).then(album => {
    if (!album) {
      res.status(404).json({ error: "The album could not be found."})
    } else {
      res.status(200).json(album);
    }
  });
};

exports.updateAlbum = (req, res) => {
  const {albumId} = req.params;
  const {artistId} = req.body;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist && artistId) {
      res.status(404).json({ error: "The artist could not be found."});
    } else {
      Album.update(req.body, {where: {id: albumId}}).then(([rowsUpdated]) => {
        if (!rowsUpdated) {
          res.status(404).json({ error: "The album could not be found."})
        } else {
          res.status(200).json({ result: "Rows were updated"}); //.json(rowsUpdated) sends artist, not rows
        }
      })
    }
  })
};

exports.deleteAlbum = (req, res) => {
  const { albumId } = req.params;
  Album.destroy({ where: {id: albumId} }).then((album) => {
    if (!album) {
      res.status(404).json({error: "The album could not be found."})
    } else {
      res.status(204).end();
    }
  });
};
