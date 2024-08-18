import express from 'express';
import passport from 'passport';
import * as serv from '../controllers/userController.js';

export const router = express.Router();

router.get('/', serv.renderHome);
router.get('/loginPage', serv.renderLogin);
router.get('/register', serv.renderRegister);
router.get('/ecommerce', serv.renderEcom);

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

router.post('/register', serv.register);

router.get('/shop', serv.renderShop);

router.get('/shop/product/:id', serv.renderProductPage);

router.get('/shop/:category', serv.viewAll);

router.post('/cart', serv.addToCart);

router.get('/cart', serv.renderCart);

router.post('/cart/remove', serv.removeProduct);

router.post('/cart/increase', serv.increaseQuant);

router.post('/cart/decrease', serv.decreaseQuant);

router.post('/checkout', serv.checkout);

router.get('/success', serv.renderSuccess);

router.get('/cancel', serv.renderCancel);

router.get('/orders', serv.renderOrders);

router.post('/close', serv.closeNav);