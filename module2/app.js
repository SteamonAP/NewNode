const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const path = require('path');
const app = express();

const adminData = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.set('view engine', 'ejs');
app.set('views', 'views');

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).render('404', {pageTitle: "Page not Found"});
})

app.listen(PORT, () => {
    console.log(`The server's running on ${PORT}`);
});
