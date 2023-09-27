import express from "express";
import mongoose from "mongoose";
import crypt from "bcryptjs";
import { userModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  const user = req.body;
  console.log("User info revieved::", user);
  //validating user input
  if (!user.fname || !user.mob || !user.pwd) {
    return res.status(400).json({
      Error: "First Name, MObile and Password can not be blank.",
    });
  }
  //checking if user already exists
  userModel.findOne({ mob: user.mob }).then((userFound) => {
    if (userFound) {
      return res.status(500).json({ Error: "Mobile number already exists" });
    }
    //encrytping the password
    crypt.hash(user.pwd, 16).then((pwdHashed) => {
      //creating and saving the user in the database
      userModel
        .create({
          fname: user.fname,
          lname: user.lname,
          mob: user.mob,
          pwd: pwdHashed,
          email: user.email,
          dp: user.dp,
        })
        .then(
          res.status(200).json({ Success: "User Successfully registered" })
        );
    });
  });
});

//Login Route
userRouter.post("/login", (req, res) => {
  const user = req.body;
  //validating user input
  if (!user.mob || !user.pwd) {
    return res.status(400).json({
      Error: "Invalid credenatials",
    });
  }
  //checking if user exists
  userModel.findOne({ mob: user.mob }).then((userFound) => {
    if (!userFound) {
      return res.status(500).json({ Error: "User does not exists" });
    }
    //matching the password
    crypt.compare(user.pwd, userFound.pwd).then((pwdMatched) => {
      if (pwdMatched) {
        const jwtToken = jwt.sign({ _id: userFound._id }, JWT_SECRET);
        return res
          .status(200)
          .json({
            result: { token: jwtToken },
            Success: "User Successfully Logged In",
            user: user.fname,
          });
      }
      return res.status(500).json({ Error: "Incorrect password" });
    });
  });
});
