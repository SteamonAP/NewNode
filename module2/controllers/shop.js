const Product = require("../models/product.js");
const Order = require("../models/order.js");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(totalProducts => {
      totalItems = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/product",
        currentPage: page,
        hasNextPage: (ITEMS_PER_PAGE * page) < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE)

      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemfromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        products: products,
        user: {
          email: req.user.email,
          userId: req.user,
        },
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) throw new Error("Order not found");
      if (order.user.userId.toString() !== req.user._id.toString())
        throw new Error("Unauthorized");

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      // HEADER
      pdfDoc.fontSize(20).text(" MyShop Pvt. Ltd.", { align: "center" });
      pdfDoc.moveDown();
      pdfDoc.fontSize(26).text("INVOICE", { align: "center", underline: true });
      pdfDoc.moveDown();

      // ORDER INFO
      pdfDoc.fontSize(12).text(`Invoice ID: ${orderId}`);
      pdfDoc.text(`Email: ${order.user.email}`);
      pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
      pdfDoc.moveDown();

      // TABLE HEADER
      pdfDoc.fontSize(14).text("Product", 50, pdfDoc.y, { bold: true });
      pdfDoc.text("Qty", 250, pdfDoc.y, { bold: true });
      pdfDoc.text("Price", 300, pdfDoc.y, { bold: true });
      pdfDoc.text("Total", 400, pdfDoc.y, { bold: true });
      pdfDoc.moveDown();

      pdfDoc.moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();
      pdfDoc.moveDown();

      let totalPrice = 0;

      order.products.forEach((prod) => {
        const { title, price } = prod.product;
        const { quantity } = prod;
        const itemTotal = price * quantity;
        totalPrice += itemTotal;

        pdfDoc.fontSize(12).text(title, 50, pdfDoc.y);
        pdfDoc.text(quantity.toString(), 250, pdfDoc.y);
        pdfDoc.text(`₹${price.toFixed(2)}`, 300, pdfDoc.y);
        pdfDoc.text(`₹${itemTotal.toFixed(2)}`, 400, pdfDoc.y);
        pdfDoc.moveDown();
      });

      pdfDoc.moveDown();
      pdfDoc.moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();

      // TOTAL
      pdfDoc.moveDown();
      pdfDoc
        .fontSize(16)
        .text(`Total Amount: ₹${totalPrice.toFixed(2)}`, { align: "right" });

      // FOOTER
      pdfDoc.moveDown(2);
      pdfDoc
        .fontSize(10)
        .text(
          "This is a computer-generated invoice and does not require a signature.",
          {
            align: "center",
            italics: true,
          }
        );

      pdfDoc.end();
    })
    .catch((err) => next(err));
};
