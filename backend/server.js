// initializing server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose"); // import mongoose - to use Mongo
require("dotenv").config(); // import dotenv
const { DB_URI } = process.env; // to grab the same variable from the dotenv file 
// DB_URI--> needs {} to be deconstructed b/c comes as several things from .env
const cors = require("cors"); // for disabling default browser security
// when running server internally, need to use cors - NOT for external use, if publishing
const Product = require("./models/product.js"); // import the model SCHEMA

// middleware
server.use(express.json()); // to ensure data is transmittd as json
server.use(express.urlencoded({ extended: true })); // to ensure data is encoded/decoded during transmission
server.use(cors()); // run as a function -- enable security disabling

// database connection and server listening
mongoose
  .connect(DB_URI) // could use async but use .then b/c it explains what happens better
  .then(() => {
    server.listen(port, () => {
      console.log(`PRODUCTS Database is connected.\n Server Listening on ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

// routes

// ROOT route:generic
server.get("/", (request, response) => {
  response.send("Server is LIVE!");
});

// to get all the data from products db --> since it's going all the way to the server then back, use async/await functions to allow time to fetch info
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// to get ONE product by id
server.get("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// POST = middle-man will accept the package and send it to the database
// to post a new product to DB
server.post("/products", async (request, response) => {
  const { productName, brand, image, price } = request.body;
  const newProduct = new Product({
// should I add forced id if mongo creates auto gen _id???
    productName, // no need to write productName:productName
    brand,
    image,
    price, // $ as string - need to extract
// currentPrice: parseFloat(prod.price ? prod.price.slice(1) : 0), slice-off $ from start, turnary to ensure never NULL, if price exists=> adjust, else price=0... PRICE 0 would be really bad in real-world use, ppl could "purchase" for free --- works for now.
  });
  try {
    await newProduct.save();
    response
      .status(200)
      .send({
        message: `Product added successfully.`,
        date: new Date(Date.now()),
      });
    // deleting with the correct id but adding with a bogus id b/c id hasnt been generated yet...
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// to delete a product from DB by its id
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Product.findByIdAndDelete(id);
    response.send({ message: `Product is deleted: ${id}` });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});


// PATCH maintains old id -- USED MOST in real life, "twin" sister is PUT but...
// PUT will delete the whole old doc and create new id, not often used

// to Patch a product by id
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  try {
    await Product.findByIdAndUpdate(id, {
        productName, 
        brand, 
        image, 
        price,
    });
    response.send({
      message: `Product updated`,
      date: new Date(Date.now()),
    });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
