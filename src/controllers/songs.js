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

exports.getSongs = (req, res) => {
  Song.findAll({
    include: [
      {
        model: Artist,
        as: 'artist'
      },
      {
        model: Album,
        as: 'album'
      }
    ]
  }).then(songs => res.status(200).json(songs))
};

exports.getSongById = (req, res) => {
  const {songId} = req.params;
  Song.findByPk(songId, {
    include: [
      {
        model: Artist,
        as: 'artist'
      },
      {
        model: Album,
        as: 'album'
      }
    ]
  }).then(song => {
    if (!song) {
      res.status(404).json({ error: "The song could not be found."})
    } else {
      res.status(200).json(song);
    }
  });
};

exports.updateSong = (req, res) => {
  const {songId} = req.params;
  const {albumId, artistId} = req.body;

  // Artist.findByPk(artistId).then((artist) => {
  //   if (!artist && artistId) {
  //     res.status(404).json({ error: "The artist could not be found."});
  //   } else {
  //     Song.update(req.body, {where: {id: songId}}).then(([rowsUpdated]) => {
  //       if (!rowsUpdated) {
  //         res.status(404).json({ error: "The song could not be found."})
  //       } else {
  //         res.status(200).json({ result: "Rows were updated"}); //.json(rowsUpdated) sends artist, not rows
  //       }
  //     })
  //   }
  // })




  Album.findByPk(albumId).then((album) => {
    if (!album && albumId) {
      res.status(404).json({ error: "The album could not be found."});
    } else {
      Artist.findByPk(artistId).then((artist) => {
        if (!artist && artistId) {
          res.status(404).json({ error: "The artist could not be found."});
        } else {
          Song.update(req.body, {where: {id: songId}}).then(([rowsUpdated]) => {
            if (!rowsUpdated) {
              res.status(404).json({ error: "The song could not be found."})
            } else {
              res.status(200).json({ result: "Rows were updated"}); //.json(rowsUpdated) sends artist, not rows
            }
          })
        }
      }) 
    }
  })
}
