const express = require("express");

const app = express();

const artistControllers = require("./controllers/artists"); //controller function imported

app.use(express.json()); //middleware

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/artists", artistControllers.create);

module.exports = app;
