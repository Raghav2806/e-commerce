import { registerUser } from "../services/userServices.js";
import { ApiError } from "../errors/ApiError.js";

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
    if (req.isAuthenticated()) {
      res.render('ecommerce.ejs');
    } else {
      res.redirect('/login');
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
