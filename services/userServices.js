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
  decreaseQuantity,
  emptyCart
} from "../repositories/cartRepositories.js";
import Stripe from 'stripe';
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

export async function removeProdFromCart(userId,productId) {
  try{
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

export async function checkingOut(userData) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
    const userId = userData.userId;
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US','IN']
      },
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productId.name,
            images: [item.productId.image],
          },
          unit_amount: item.productId.price * 100, // Stripe expects the amount in cents
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.SERVER_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SERVER_URL}/cancel`,
    })
    return session;
}