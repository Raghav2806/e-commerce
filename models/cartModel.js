import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, default: 1 },
      price: {type: Number}
    }],
    totalPrice: {type: Number, default: 0}
  });

  const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;