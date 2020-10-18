/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      artist2 = await Artist.create({
        name: "Kylie Minogue", 
        genre: "Pop",
      });
      artist3 = await Artist.create({
        name: "Dave Brubeck", 
        genre: "Jazz", 
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);
          
          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });

    describe("with albums in the database", () => {
      let albums;
      beforeEach((done) => {
        Promise.all([
          request(app).post(`/artists/${artist.id}/albums`).send({ name: "InnerSpeaker", year: 2010 }),
          request(app).post(`/artists/${artist2.id}/albums`).send({ name: "Fever", year: 2001 }),
          request(app).post(`/artists/${artist3.id}/albums`).send({ name: "At Carnegie Hall", year: 1963 }),
        ]).then((documents) => {
          albums = documents.map(albumPromise => albumPromise.body);
          done();
        });
      });

      describe("GET /albums", () => {
        it("gets all album records", (done) => {
          request(app)
            .get("/albums")
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.length).to.equal(3);
              res.body.forEach((album) => {
                const expected = albums.find((a) => a.id === album.id);
                expect(album.name).to.equal(expected.name);
                expect(album.year).to.equal(expected.year);
                expect(album.artistId).to.equal(expected.artistId);
              });
              done();
            });
        });
      });


    });
  });
});
