import express from "express";
import { jwtMiddleware } from "./JWTRoute.js";
import { postModel } from "../models/PostModel.js";

export const postRouter = express.Router();

//route for creating post
postRouter.post("/createPost", jwtMiddleware, (req, res) => {
  const post = req.body;
  console.log("postRoute: Post rcvd::", post);
  if (!post.title || !post.img) {
    return res
      .status(400)
      .json({ Error: "Post title and image are mandatory" });
  }
  postModel
    .create({
      title: post.title,
      desc: post.desc,
      img: post.img,
      author: post.author,
    })
    .then((postCreated) => {
      return res.status(200).json({
        title: post.title,
        imgPath: post.img,
        msg: "recvd successfuly",
        id: postCreated._id,
      });
    });
});

//route to get all the posts
postRouter.get("/allPosts", (req, res) => {
  postModel
    .find()
    .populate("author", "_id, fname")
    .then((posts) => {
      return res.status(200).json({ posts: posts });
    });
});

//route to get my posts
postRouter.get("/myPosts", jwtMiddleware, (req, res) => {
  postModel
    .find({ author: req.user._id })
    .populate("author", "_id, fname")
    .then((posts) => {
      return res.status(200).json({ posts: posts });
    });
});

//route to delete post
postRouter.delete("/delete/:postId", jwtMiddleware, (req, res) => {
  postModel
    .findById(req.params.postId)
    .deleteOne()
    .then((data) => {
      console.log("postRoute: Delete data", data);
      return res.status(200).json({ dt: data, msg: "Sucess" });
    })
    .catch((err) => {
      return res.status(500).json({ Error: "Post not found", err: err });
    });
});

//route to like the post
postRouter.put("/like/:postId", jwtMiddleware, (req, res) => {
  postModel
    .findOneAndUpdate(
      { _id: req.params.postId },
      { $push: { like: req.user._id } }
    )
    .exec()
    .then((data) => res.status(200).json({ data: data, msg: "Success" }))
    .catch((err) => res.status(500).json({ err: err }));
});

//route to like the post
postRouter.put("/unlike/:postId", jwtMiddleware, (req, res) => {
  postModel
    .findOneAndUpdate(
      { _id: req.params.postId },
      { $pull: { like: req.user._id } }
    )
    .exec()
    .then((data) => res.status(200).json({ data: data, msg: "Success" }))
    .catch((err) => res.status(500).json({ err: err }));
});

//route to comment the post
postRouter.put("/addComment/:postId", jwtMiddleware, (req, res) => {
  postModel
    .findOneAndUpdate(
      { _id: req.params.postId },
      {
        $push: {
          comments: { comment: req.body.comment, commentedBy: req.user._id },
        },
      },
      {
        new: true,
      }
    )
    .exec()
    .then((data) => res.status(200).json({ data: data, msg: "Success" }))
    .catch((err) => res.status(500).json({ err: err }));
});
