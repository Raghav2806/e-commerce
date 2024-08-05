import { 
  registerUser,
  addingToCart,
  removeProdFromCart,
  increaseProdQuant,
  decreaseProdQuant, 
  checkingOut
} from "../services/userServices.js";
import { ApiError } from "../errors/ApiError.js";
import domains from "../const.js";
import {
  findFirstProducts,
  findProductsByDomain,
  getDistinctBrands,
  getFeaturedProducts,
  getNewProducts,
  findProductsByDomainAndBrands
} from "../repositories/productRepositories.js";
import { emptyCart } from "../repositories/cartRepositories.js";
import cartModel from "../models/cartModel.js";
import Stripe from 'stripe';
import * as dotenv from "dotenv";
import { addOrder } from "../repositories/orderRepositories.js";
import orderModel from "../models/ordersModel.js";
dotenv.config();

export const renderHome = (req, res) => {
  res.render("home.ejs");
};

export const renderLogin = (req, res) => {
  res.render("login.ejs");
};

export const renderRegister = (req, res) => {
  res.render("register.ejs");
};

export async function renderEcom (req, res) {
  try {
    if (req.isAuthenticated()) {
      const featured = await getFeaturedProducts();
      const newprod = await getNewProducts();
      let cartItems = [];
      const userId = req.session.passport.user._id;
      const cart = await cartModel.findOne({ userId }).populate('items.productId');
      if (cart) {
        cartItems = cart.items;
      }
      res.render("ecommerce.ejs", {
        featured: featured,
        newprod: newprod,
        cartItems: cartItems,
        userId: cart.userId
      });
    } else {
      res.redirect("/loginPage");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
};

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    req.login(user, (err) => {
      console.log("success");
      res.redirect("/ecommerce");
    });
  } catch (err) {
    if ((err.message = "User already exists")) {
      res.redirect("/loginPage");
      next(ApiError.badRequest(err.message));
    } else {
      res.redirect("/register");
      next(ApiError.badRequest(err.message));
    }
  }
}

export async function renderShop(req, res) {
  try {
    if (req.isAuthenticated()) {
      const categories = {};
      for (let i = 0; i < domains.length; i++) {
        categories[`${domains[i]}`] = await findFirstProducts(domains[i]);
      }
      let cartItems = [];
      const userId = req.session.passport.user._id;
      const cart = await cartModel.findOne({ userId }).populate('items.productId');
      if (cart) {
        cartItems = cart.items;
      }
      res.render("shop.ejs", {
        categories: categories,
        isCategoryPage: false,
        cartItems: cartItems,
        userId: cart.userId
      });
    } else {
      res.redirect("/loginPage");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function viewAll(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      const category = req.params.category; //get request: req.query, post request req.body
      let selectedBrands = req.query.brands || []; //Used to retrieve query parameters from the URL. If the URL is /shop/category?brands=BrandA&brands=BrandB, the query parameters brands can be accessed via req.query.brands.
      const categories = {};
      const brands=await getDistinctBrands(category);
      let sortByPrice = req.query.asc==='asc' || req.query.des==='des';
      const sorting = req.query.asc || req.query.des || 0;
      if (selectedBrands.length > 0 || sortByPrice) {
        categories[`${category}`] = await findProductsByDomainAndBrands(category, selectedBrands, sorting);
      } else {
        categories[`${category}`] = await findProductsByDomain(category);
      }
      let cartItems = [];
      const userId = req.session.passport.user._id;
      const cart = await cartModel.findOne({ userId }).populate('items.productId');
      if (cart) {
        cartItems = cart.items;
      }
      res.render("shop.ejs", {
        categories: categories,
        isCategoryPage: true,
        category:category,
        selectedBrands: selectedBrands,
        brands: brands,
        sorting: sorting,
        cartItems: cartItems,
        userId: cart.userId
      });
    } else {
      res.redirect("/loginPage");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function addToCart(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      const userId = req.session.passport.user._id;
      await addingToCart(req.body,userId)
      const referer = req.headers.referer || '/cart';
      res.redirect(referer);
    } else {
      res.redirect("/loginPage");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function renderCart(req, res, next)  {
  try {
    if (req.isAuthenticated()) {
      const userId = req.session.passport.user._id;
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    
    if (cart) {
      res.render('cart.ejs', { cartItems: cart.items, totalPrice: cart.totalPrice, userId: cart.userId });
    } else {
      res.render('cart.ejs', { cartItems: [], totalPrice: 0, userId: userId });
    }
    } else {
      res.redirect("/loginPage");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
};

export async function removeProduct(req, res, next) {
  try{
    if(req.isAuthenticated()) {
      await removeProdFromCart(req.body.userId,req.body.productId);
      res.redirect("/cart")
    } else {
      res.redirect("/loginPage")
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function increaseQuant(req, res, next) {
  try{
    if(req.isAuthenticated()) {
      await increaseProdQuant(req.body);
      const referer = req.headers.referer || '/cart';
      res.redirect(referer);
    } else {
      res.redirect("/loginPage")
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function decreaseQuant(req, res, next) {
  try{
    if(req.isAuthenticated()) {
      await decreaseProdQuant(req.body);
      const referer = req.headers.referer || '/cart';
      res.redirect(referer);
    } else {
      res.redirect("/loginPage")
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function checkout(req, res, next) {
  try{
    const session= await checkingOut(req.body)
    res.redirect(session.url)
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function renderSuccess(req, res, next) {
  try {
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
    const userId = req.session.passport.user._id;
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    const result = await Promise.all([ //multiple await together
      stripe.checkout.sessions.retrieve(req.query.session_id,{expand: ['payment_intent.payment_method']}),
      stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])
    await addOrder(cart,result[0]);
    await emptyCart(userId);
    res.render("success.ejs",{
      final:result
    });
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function renderOrders(req, res, next)  {
  try {
    if (req.isAuthenticated()) {
    const userId = req.session.passport.user._id;
    const allOrders = await orderModel.findOne({ userId }).populate('orders.items.productId');
    const cart = await cartModel.findOne({ userId }).populate('items.productId');
    if (allOrders) {
      res.render('orders.ejs', { orders: allOrders.orders, userId: allOrders.userId, cartItems: cart.items });
    } else {
      res.render('orders.ejs', { orders: [], userId: userId, cartItems: cart.items });
    }
    } else {
      res.redirect("/loginPage");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
};