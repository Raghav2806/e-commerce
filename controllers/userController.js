import { 
  registerUser,
  addingToCart,
  removeProdFromCart,
  increaseProdQuant,
  decreaseProdQuant 
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
import cartModel from "../models/cartModel.js";

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
      res.render("ecommerce.ejs", {
        featured: featured,
        newprod: newprod,
      });
    } else {
      res.redirect("/login");
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
      res.redirect("/login");
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
      res.render("shop.ejs", {
        categories: categories,
        isCategoryPage: false,
      });
    } else {
      res.redirect("/login");
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

      res.render("shop.ejs", {
        categories: categories,
        isCategoryPage: true,
        category:category,
        selectedBrands: selectedBrands,
        brands: brands,
        sorting: sorting
      });
    } else {
      res.redirect("/login");
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
      res.json({success: true, message: "Item added to cart"});
    } else {
      res.redirect("/login");
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
      res.render('cart.ejs', { cartItems: [], totalPrice: 0 });
    }
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
};

export async function removeProduct(req, res, next) {
  try{
    if(req.isAuthenticated()) {
      await removeProdFromCart(req.body);
      res.redirect("/cart")
    } else {
      res.redirect("/login")
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function increaseQuant(req, res, next) {
  try{
    if(req.isAuthenticated()) {
      await increaseProdQuant(req.body);
      res.redirect("/cart")
    } else {
      res.redirect("/login")
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function decreaseQuant(req, res, next) {
  try{
    if(req.isAuthenticated()) {
      await decreaseProdQuant(req.body);
      res.redirect("/cart")
    } else {
      res.redirect("/login")
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}