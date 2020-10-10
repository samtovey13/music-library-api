const express = require("express");

const app = express();

const artistControllers = require("./controllers/artists"); //controller function imported

app.use(express.json()); //middleware

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/artists", artistControllers.create);

app.get("/artists", artistControllers.list);

app.get("/artists/:artistId", artistControllers.findById);

app.patch("/artists/:id", artistControllers.updateArtist);

app.delete("/artists/:id", artistControllers.deleteArtist);

module.exports = app;
