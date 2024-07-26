import express from 'express';
import passport from 'passport';
import {
  renderHome,
  renderLogin,
  renderRegister,
  renderEcom,
  register,
  renderShop,
  viewAll,
  addToCart,
  renderCart,
  removeProduct,
  increaseQuant,
  decreaseQuant,
  checkout,
  renderSuccess
} from '../controllers/userController.js';

export const router = express.Router();

router.get('/', renderHome);
router.get('/loginPage', renderLogin);
router.get('/register', renderRegister);
router.get('/ecommerce', renderEcom);

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/ecommerce', passport.authenticate('google', {
  successRedirect: '/ecommerce',
  failureRedirect: '/loginPage'
}));

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/ecommerce",
    failureRedirect: "/loginPage",
  })
);

router.post('/register', register);

router.get('/shop', renderShop);

router.get('/shop/:category', viewAll);

router.post('/cart', addToCart);

router.get('/cart', renderCart);

router.post('/cart/remove', removeProduct);

router.post('/cart/increase', increaseQuant);

router.post('/cart/decrease', decreaseQuant);

router.post('/checkout', checkout);

router.get('/success', renderSuccess);

router.get('/cancel', (req, res) => {
  res.render('cancel.ejs'); // Render a cancel page or do additional logic
});