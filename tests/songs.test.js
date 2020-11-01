const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Song, Artist, Album } = require('../src/models');

describe('/songs', () => {
  let artist;
  let album;
  let newArtist;
  let newAlbum;
  let songs;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      album = await Album.create({
        name: "InnerSpeaker", 
        year: 2010
      }).then(album => album.setArtist(artist));
      newArtist = await Artist.create({
        name: 'Another Artist',
        genre: 'Pop'
      });
      newAlbum = await Album.create({
        name: "Another Album", 
        year: 2021
      }).then(album => album.setArtist(newArtist));
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST albums/:albumId/songs', () => {
    it('creates a new song under an album', (done) => {
      request(app)
        .post(`/albums/${album.id}/songs`)
        .send({
          artist: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(201);
          const songId = res.body.id;
          expect(res.body.id).to.equal(songId);
          expect(res.body.name).to.equal('Solitude Is Bliss');
          expect(res.body.artistId).to.equal(artist.id);
          expect(res.body.albumId).to.equal(album.id);
          done();
        });
    });
    it('returns a 404 if the album does not exist', (done) => {
      request(app)
        .post(`/albums/12345/songs`)
        .send({
          artist: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The album could not be found.');
        
          Song.findAll().then((songs) => {
            expect(songs.length).to.equal(0);
            done();
          });
        })
    })
  })

  describe('with songs in the database', () => {
    beforeEach((done) => {
      Promise.all([
        Song.create({
          artistId: artist.id,
          albumId: album.id,
          name: 'Solitude Is Bliss',
        }),
        Song.create({
          artistId: artist.id,
          albumId: album.id,
          name: 'Silence Is Golden',
        }),
        Song.create({
          artistId: artist.id,
          albumId: album.id,
          name: "Sunny Afternoon"
        })
      ]).then((documents) => {
        songs = documents;
        done();
      });
    });
    

    describe('GET /songs', () => {
      it('gets all songs in the database', (done) => {
        request(app)
          .get(`/songs`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((song) => {
              const expected = songs.find((s) => s.id === song.id);
              expect(song.id).to.equal(expected.id);
              expect(song.name).to.equal(expected.name);
              expect(song.artist.id).to.equal(artist.id);
              expect(song.artist.genre).to.equal(artist.genre);
              expect(song.album.id).to.equal(album.id);
              expect(song.album.year).to.equal(album.year);
              expect(typeof song.artist).to.equal('object');
              expect(typeof song.album).to.equal('object');
            });
            done();
          })
      })
    })

    describe('GET /songs/:songId', () => {
      it('gets a song by id', (done) => {
        song = songs[0];
        request(app)
          .get(`/songs/${song.id}`)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.id).to.equal(song.id);
            expect(res.body.name).to.equal(song.name);
            expect(res.body.artist.id).to.equal(artist.id);
            expect(res.body.artist.genre).to.equal(artist.genre);
            expect(res.body.album.id).to.equal(album.id);
            expect(res.body.album.year).to.equal(album.year);
            expect(typeof res.body.artist).to.equal('object');
            expect(typeof res.body.album).to.equal('object');
            done();
          })
      });

      it('returns a 404 if the song is not found', (done) => {
        request(app)
          .get(`/songs/12345`)
          .then(res => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The song could not be found.");
            done();
          })
      });

    })

    describe('PATCH /songs/:songId', () => {

      it('updates song name by id', (done) => {
        song = songs[0];
        request(app)
          .patch(`/songs/${song.id}`)
          .send({
            name: 'New Song Name'
          })
          .then(res => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id).then(song => {
              expect(song.name).to.equal('New Song Name');
              done();
            })
          })
      })
      it('updates song artist by id', (done) => {
        song = songs[0];
        request(app)
          .patch(`/songs/${song.id}`)
          .send({
            artistId: `${newArtist.id}`
          })
          .then(res => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id).then(song => {
              expect(song.artistId).to.equal(newArtist.id);
              done();
            })
          })
      })

      it('updates song name, artist and album in one request', (done) => {
        song = songs[0];
        request(app)
        .patch(`/songs/${song.id}`)
        .send({
          name: 'New Song Name',
          artistId: `${newArtist.id}`,
          albumId: `${newAlbum.id}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          Song.findByPk(song.id).then(song => {
            expect(song.name).to.equal('New Song Name');
            expect(song.artistId).to.equal(newArtist.id);
            expect(song.albumId).to.equal(newAlbum.id);
            done();
          })
        })
      })

      it('returns a 404 if the song is not found', (done) => {
        request(app)
        .patch(`/songs/12345`)
        .send({
          name: 'New Song Name'
        })
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The song could not be found.");
          done();
        })
      })

      it('throws an error if the album does not exist', (done) => {
        song = songs[0];
        request(app)
        .patch(`/songs/${song.id}`)
        .send({
          albumId: 99999
        })
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The album could not be found.");
          done();
        })
      })

      it('throws an error if the artist does not exist', (done) => {
        song = songs[0];
        request(app)
        .patch(`/songs/${song.id}`)
        .send({
          artistId: 99999
        })
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The artist could not be found.");
          done();
        })
      })
    })

    describe('DELETE /songs/songId', () => {
      it('deletes a song by id', (done) => {
        song = songs[0];
        request(app)
        .delete(`/songs/${song.id}`)
        .then(res => {
          expect(res.status).to.equal(204);
          Song.findByPk(song.id).then(result => {
            expect(result).to.equal(null);
            done();
          })
        })
      })

      it('returns a 404 if the song does not exist', (done) => {
        request(app)
        .delete(`/songs/99999`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal("The song could not be found.");
          done();
        })
      })
    })

  }) //end of decribe('with songs in the database')
})
