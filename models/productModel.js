import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  brand: String,
  price: String,
  stock: Number,
  image: String,
  domain: String,
  featured: Boolean
});

const productModel = mongoose.model("products", productSchema);

export default productModel;