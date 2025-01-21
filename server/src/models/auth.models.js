import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    age:{
        type: Number,
        min: [10,"You are not eligible for this application"],
        max: 99,
    },
    avatar:{
        type: String
    },
    token:{
        type: String
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateToken = function() {
    return jwt.sign(
        {
            _id: this._id
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
};


const User = mongoose.model("User",userSchema);

export default User;