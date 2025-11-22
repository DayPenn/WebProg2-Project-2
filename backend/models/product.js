// initializing the model schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the product model schema
const productSchema = new Schema({
 // id: {}, ////////////////////////////////////////////////// <-- blank or need more??
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
    price: {
    type: String, // $included in string
    required: true,
  },
});

// package and export model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
