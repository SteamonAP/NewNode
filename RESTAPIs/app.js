const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH' ,'DELETE'],
  credentials: true
}));

const feedRoutes = require("./routes/feed.js");
const authRoutes = require("./routes/auth.js");

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
    cb(null, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);


app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client Connected');
    }); 
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
