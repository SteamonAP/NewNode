const db = require('../utils/db.js');
const Cart = require('./cart');


module.exports = class Product {
  constructor(id ,title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, parseFloat(this.price.toFixed(2)), this.imageUrl, this.description]
    );

  }
  static delete(id){

  }
  static fetchData() {

    return db.execute('SELECT * FROM products')



  }
  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);

  }
};
