import cartModel from "../models/cartModel.js";
import { removeProdFromCart } from "../services/userServices.js";
import { findProductById } from "./productRepositories.js";

export async function updateCartTotal(userId) {
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    if (cart) {
      const totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
      cart.totalPrice = totalPrice;
      await cart.save();
    }
  }

export async function addProductToUserCart(userId,productId){
    const cart = await cartModel.findOne({userId});
    const product = await findProductById(productId);
    if (cart) {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1; // Increment quantity if item already in cart
        } else {
          cart.items.push({ productId, price:product.price, quantity: 1 }); // Add new item if not already in cart
        }
        await cart.save();
        await updateCartTotal(userId);
      } else {
        await cartModel.create({ userId, items: [{ productId, price:product.price, quantity: 1 }]});
        await updateCartTotal(userId);
      }
}

export async function increaseQuantity(userId,productId){
    const cart = await cartModel.findOne({userId});
    if(cart) {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1; // Increment quantity if item already in cart
          } else {
            throw new Error("Item not in cart")
          }
          await cart.save();
          await updateCartTotal(userId);
    } else {
        throw new Error("Cannot find cart");
    }
}

export async function decreaseQuantity(userId,productId){
    const cart = await cartModel.findOne({userId});
    if(cart) {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            if(cart.items[itemIndex].quantity==1){
                removeProdFromCart(userId,productId);
            } else {
                cart.items[itemIndex].quantity -= 1; 
            }
          } else {
            throw new Error("Item not in cart")
          }
          await cart.save();
          await updateCartTotal(userId);
    } else {
        throw new Error("Cannot find cart");
    }
}

export async function emptyCart(userId) {
  const cart = await cartModel.findOne({userId});
  cart.items = [];
  await cart.save();
  await updateCartTotal(userId);
}