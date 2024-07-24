import {
  findUserByEmail,
  createUser,
} from "../repositories/userRepositories.js";
import {
  findProductById
} from "../repositories/productRepositories.js"
import { 
  addProductToUserCart, 
  updateCartTotal, 
  increaseQuantity, 
  decreaseQuantity } from "../repositories/cartRepositories.js";
import * as dotenv from "dotenv";
import cartModel from "../models/cartModel.js";
dotenv.config();

export async function registerUser(userData) {
  try {
    const existingUser = await findUserByEmail(userData.email);
    console.log(existingUser);
    if (existingUser) {
      throw new Error("User already exists");
    } else {
      await createUser(userData);
      return { user: userData };
    }
  } catch (err) {
    throw new Error("Unable to register!");
  }
}

export async function addingToCart(productData,userId) {
  try{
    const productId = productData.productId;
    const product = await findProductById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    await addProductToUserCart(userId, productId);
  } catch (err) {
    throw new Error("Unable to add to cart!");
  }
}

export async function removeProdFromCart(cartData) {
  try{
    const userId=cartData.userId;
    const productId=cartData.productId;
    const cart=await cartModel.findOne({userId});
    if(cart){
      // Remove the product from the cart's items array
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      await updateCartTotal(userId);
    } else {
      throw new Error("Cart not found");
    }
  } catch (err) {
    throw new Error("Unable to remove from cart!");
  }
}

export async function increaseProdQuant(cartData) {
  try{
    const userId=cartData.userId;
    const productId=cartData.productId;
    await increaseQuantity(userId,productId);
  } catch (err) {
    throw new Error("Unable to increase quantity");
  }
}

export async function decreaseProdQuant(cartData) {
  try{
    const userId=cartData.userId;
    const productId=cartData.productId;
    await decreaseQuantity(userId,productId);
  } catch (err) {
    throw new Error(err);
  }
}