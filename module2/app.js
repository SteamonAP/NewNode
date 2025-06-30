const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const crypto = require("crypto");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const path = require("path");
const fs = require("fs");
const https = require("https");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/uploads");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, function (err, filename) {
      const fn = filename.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
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

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");
const errorContollers = require("./controllers/error.js");
const connectDB = require("./utils/db.js");
const User = require("./models/user.js");
app.set("view engine", "ejs");
app.set("views", "views");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //middleware
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorContollers.get500);
app.use(errorContollers.get404);

app.use((error, req, res, next) => {
  // res.redirect('/500');
  res.status(500).render("500", {
    pageTitle: "Erro !",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

connectDB().then(() => {
  // https
  //   .createServer({ key: privateKey, cert: certificate }, app)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
});
