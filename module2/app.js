const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const path = require("path");
const app = express();

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const errorContollers = require("./controllers/error.js");
const db = require("./utils/db.js");

app.set("view engine", "ejs");
app.set("views", "views");


dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorContollers.get404);

app.listen(PORT, () => {
  console.log(`The server's running on ${PORT}`);
});
