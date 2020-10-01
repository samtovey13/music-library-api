/* artists.test.js */
const { expect } = require("chai");
const request = require("supertest");
const { Artist } = require("../src/models");
const app = require("../src/app");

describe("/artists", () => {
  // before in mocha is like beforeAll in jest. //
  // we are using it to connect to the Artist table //
  before(async () => {
    try {
      await Artist.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  // to clean out the Artist table before each test //
  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  //test creates a new artist by sending the data (name + genre) to an /artists endpoint //

  describe("POST /artists", async () => {
    it("creates a new artist in the database", async () => {
      const response = await request(app).post("/artists").send({
        name: "Tame Impala",
        genre: "Rock",
      });

      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Tame Impala');

      const insertedArtistRecords = await Artist.findByPk(response.body.id, { raw: true });
      expect(insertedArtistRecords.name).to.equal('Tame Impala');
      expect(insertedArtistRecords.genre).to.equal('Rock');
    });
  });
});
