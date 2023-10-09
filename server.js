import express from "express";
import mongoose from "mongoose";
// import { userSchema } from "./models/UserModel.js";
import cors from "cors";
import { JWT_SECRET, MongoDbURL, mongoCloudURL } from "./config.js";
import { userRouter } from "./routes/UserRoutes.js";
import jwt from "jsonwebtoken";
import { userModel } from "./models/UserModel.js";
import { postRouter } from "./routes/PostRoute.js";
import { fRouter } from "./routes/FileRoute.js";


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
app.use(cors());

//setting up the router
app.use(userRouter);
app.use(postRouter);
app.use(fRouter);
//starting the server
app.listen(6060, () => {
  console.log("Server satrted");
});
