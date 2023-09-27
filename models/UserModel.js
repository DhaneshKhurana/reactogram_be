import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String
    },
    mob:{
        type:Number,
        required:true
    },
    pwd:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    dp:{
        type:String,
        default:"../img/avatar.jpg"
    }
});

//Registering mongoose schemas
export const userModel = mongoose.model("UserModel", userSchema);