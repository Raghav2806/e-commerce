import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  brand: String,
  price: Number,
  stock: Number,
  image: String,
  domain: String,
  featured: Boolean,
  new: Boolean
});

const productModel = mongoose.model("products", productSchema);

export default productModel;