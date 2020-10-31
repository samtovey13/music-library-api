const express = require("express");

const app = express();

const artistControllers = require("./controllers/artists"); //controller function imported
const albumControllers = require("./controllers/albums");
const songControllers = require("./controllers/songs");

app.use(express.json()); //middleware

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// Artist routes
app.post("/artists", artistControllers.create);
app.get("/artists", artistControllers.list);
app.get("/artists/:artistId", artistControllers.findById);
app.patch("/artists/:id", artistControllers.updateArtist);
app.delete("/artists/:id", artistControllers.deleteArtist);

// Album routes
app.post("/artists/:artistId/albums", albumControllers.createAlbum);
app.get("/albums", albumControllers.getAlbums);
app.get("/albums/:albumId", albumControllers.getAlbumById);
app.patch("/albums/:albumId", albumControllers.updateAlbum);
app.delete("/albums/:albumId", albumControllers.deleteAlbum);

module.exports = app;
