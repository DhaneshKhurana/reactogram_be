import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
  },
  like: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
  comments: [
    {
      comment: { type: String },
      commentedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
    },
  ],
});

export const postModel = mongoose.model("PostModel", postSchema);
