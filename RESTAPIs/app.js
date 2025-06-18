const path = require("path");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const feedRoutes = require("./routes/feed.js");

app.use(bodyParser.json());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(nul, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://amoghpitale7:Steamonap%40123@cluster0.qhwtc5h.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((res) => {
    app.listen(8080);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
