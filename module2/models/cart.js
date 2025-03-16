const fs = require('fs');
const path  = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err && fileContent.length > 0) {
                cart = JSON.parse(fileContent);
            }

            // Analyse cart
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            if (existingProduct) {
                // Product exists —> increase quantity
                updatedProduct = { ...existingProduct };
                updatedProduct.qty += 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // New product —> add to cart
                updatedProduct = { id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            // Update total price
            cart.totalPrice += +productPrice;

            // Save back to file
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log('Error saving cart:', err);
                }
            });
        });
    }
}
