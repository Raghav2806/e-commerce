import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import "./config/passportConfig.js";
import session from "express-session";
import { connectDB } from "./config/db.js";
import { router } from "./routes/userRoutes.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
connectDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
