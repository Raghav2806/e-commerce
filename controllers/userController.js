import { registerUser } from "../services/userServices.js";
import { ApiError } from "../errors/ApiError.js";
import domains from "../const.js";
import {
  findFirstProducts,
  findProductsByDomain,
  getFeaturedProducts,
  getNewProducts,
} from "../repositories/productRepositories.js";

export const renderHome = (req, res) => {
  res.render("home.ejs");
};

export const renderLogin = (req, res) => {
  res.render("login.ejs");
};

export const renderRegister = (req, res) => {
  res.render("register.ejs");
};

export const renderEcom = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      /*
      
      */
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
      const constants = {};
      for (let i = 0; i < domains.length; i++) {
        constants[`${domains[i]}`] = await findFirstProducts(domains[i]);
      }
      res.render("shop.ejs", {
        constants: constants,
        isCategoryPage: false
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function viewAll(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      const category = req.params.category;
      const constants = {};
      constants[`${category}`] = await findProductsByDomain(category);
      res.render("shop.ejs", {
        constants: constants,
        isCategoryPage: true
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}
