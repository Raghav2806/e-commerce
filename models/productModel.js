import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  stock: Number,
  image: String,
  domain: String
});

const productModel = mongoose.model("products", productSchema);

export default productModel;