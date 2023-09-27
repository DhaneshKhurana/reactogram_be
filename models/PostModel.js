import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    img:{
        type:String,
        required:true
    },
    author:{
        type:String,
    },
});

export const PostModel = mongoose.model("PostModel", postSchema);