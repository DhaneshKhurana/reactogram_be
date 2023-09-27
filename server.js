import express from "express";
import mongoose from "mongoose";
// import { userSchema } from "./models/UserModel.js";
// import cors from "cors";
import { JWT_SECRET, MongoDbURL, mongoCloudURL } from "./config.js";
import { userRouter } from "./routes/UserRoutes.js";
import jwt from "jsonwebtoken";
import { userModel } from "./models/UserModel.js";

//initialising mongoose
mongoose.connect(mongoCloudURL);

mongoose.connection.on("error", (err) =>
  console.log("The error occured while connection to db", err)
);

mongoose.connection.on("connected", () => {
  console.log("Connection Successful");
});

//initialising express
const app = express();
app.use(express.json());

//setting up the router
app.use(userRouter);

//setting jwt middleware
const jwtMiddleware = (req, res, next)=>{
  const {authorization} = req.headers;
  if(!authorization){
    return res.status(401).json({Error:"User not logged in"});
  }
  const token = authorization.replace("Bearer", "");
  jwt.verify(token, JWT_SECRET, (err, payload)=>{
    if(err){
      console.log("Some error occured while trying to authorise your request");
    }
    const {_id} = payload;
    userModel.find(_id).then(usrFound=>{
      req.user = usrFound;
      next();
    })
  });
}

//starting the server
app.listen(6060, () => {
  console.log("Server satrted");
});
