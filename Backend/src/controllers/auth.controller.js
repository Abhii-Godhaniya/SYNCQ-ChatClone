import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body;
   try{
    //HAsh password
    
    if(!fullName || !email || !password){
        return res.status(400).json({message : "All fields are required"});
    }
    if (password.length < 8){
        return res.status(400).json({message : "Password must be at least 8 Character"});
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({message:"User already exixts"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName:fullName,
        email:email,
        password:hashedPassword
    })
    if(newUser){
        //generate gwt token
        await newUser.save();
        generateToken(newUser._id,res)
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })
    }else{
        res.status(400).json({message:"Invalid user data"});
    }
   }catch(err){
        console.log("Error in signup controller",err);
        res.status(500).json({message:"Internal Server Error"});
   }
};
export const login =async (req,res)=>{
   
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid email and password" });
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    }catch(err){
        console.log("Error in login controller",err);
        res.status(500).json({message:"Internal Server Error"});
    }
};
export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0 })
        res.status(200).json({message:"Logout successfully"});
    }catch(err){
        res.status(400).json({message:"Internal server error"});
    }
};
export const updateProfile = async (req,res)=>{
    try{
        const { profilePic}  = req.body;
        const userId  = req.user._id;
        if(!profilePic){
            return res.status(400).json({message : "Profile pic is required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUserProfile = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updateUserProfile);

    }catch(err){
        console.log("Error in update profile",err.message);
        return res.status(500).json({message : "Internal server error"});
    }
}
export const checkAuthenticate = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("Error in checkauth controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}