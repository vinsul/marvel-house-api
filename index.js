// Avoir accès à proccess.env
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");

// Permet d'autoriser tous les sites à avoir accès à l'API
app.use(cors());

app.use(userRoutes);

// CREATION DE LA BDD
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
