const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const path = require("path");
const app = express();

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const errorContollers = require("./controllers/error.js");
const sequelize = require("./utils/db.js");
const Product = require('./models/product.js');
const User = require('./models/user.js');
const CartItem = require('./models/cart-item.js');
const Cart = require('./models/cart.js');
const Order = require('./models/order.js');
const OrderItem = require('./models/order-item.js')


app.set("view engine", "ejs");
app.set("views", "views");


dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next) =>{ //middleware
  User.findByPk(1)
    .then(user =>{
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorContollers.get404);



Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
  
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through : OrderItem });


sequelize
  // .sync({force:true})
  .sync()
  .then(result =>{
    return User.findByPk(1);
  })
  .then(user =>{
    if(!user){
      return User.create({ name: 'Amogh', email: 'amogh@test.com'})
    }
    return user;
  })
  .then(user =>{
    return user.createCart();
  })
  .then(cart =>{
    // console.log(user);
    app.listen(PORT, () => {
      console.log(`The server's running on ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });


