import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import {
  findUserByEmail,
} from "../repositories/userRepositories.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

passport.use(
  "local",
  new Strategy({ usernameField: 'email', passwordField: 'password' },async function verify(email, password, cb) {
    try {
      const user= await findUserByEmail(email)
      if (user) {
        bcrypt.compare(password, user.password, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb("Incorrect Password");
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ember-xpa7.onrender.com/auth/google/ecommerce",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user= await findUserByEmail(profile.email)
        if (!user) {
          await userModel.create({email:profile.email, password:"google"});
          const newUser= await findUserByEmail(profile.email);
          return cb(null, newUser);
        } else {
          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});