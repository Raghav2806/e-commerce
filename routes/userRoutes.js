import express from 'express';
import passport from 'passport';
import {
  renderHome,
  renderLogin,
  renderRegister,
  renderEcom,
  register,
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