import { JWT_SECRET } from "../config.js";
import { userModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";

//setting jwt middleware
export const jwtMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  //console.log("jwtRoute: request headers::", req.headers);
  console.log("jwtRoute: authorization::", authorization);
  if (!authorization) {
    return res.status(401).json({ Error: "User not logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log("token:", token);
  jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (err, payload) => {
    if (err) {
      console.log(
        "Some error occured while trying to authorise your request",
        err
      );
    } else {
      console.log("JWTRoute: payload:: ", payload);
      const { _id } = payload;
      userModel.findById(_id).then((userFound) => {
        req.user = userFound;
        next();
      });
    }
  });
};
