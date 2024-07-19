import { findUserByEmail, createUser } from "../repositories/userRepositories.js";
import * as dotenv from "dotenv";
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