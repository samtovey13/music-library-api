const express = require("express");

const app = express();

const artistControllers = require("./controllers/artists"); //controller function imported
const albumControllers = require("./controllers/albums");

app.use(express.json()); //middleware

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/artists", artistControllers.create);

app.get("/artists", artistControllers.list);

app.get("/artists/:artistId", artistControllers.findById);

app.patch("/artists/:id", artistControllers.updateArtist);

app.delete("/artists/:id", artistControllers.deleteArtist);

app.post("/artists/:artistId/albums", albumControllers.createAlbum);

app.get("/albums", albumControllers.getAlbums);

app.get("/albums/:albumId", albumControllers.getAlbumById);

app.patch("/albums/:albumId", albumControllers.updateAlbum);

module.exports = app;
