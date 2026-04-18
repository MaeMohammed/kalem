const User=require("../models/user.model");
const asyncHandler = require("express-async-handler");
const jwt=require("jsonwebtoken")

const generateToken=require("../utils/generateToken")
const signup=asyncHandler(async(req,res)=>{
    
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    })
    const token=generateToken(user);
    res.cookie("jwt",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:1*24*60*60*1000
    })
    res.status(201).json({success:true,data:user})
})
const login=asyncHandler(async(req,res)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
       return res.status(400).json({msg:"incorrect email or password"})
    }
    const match=await user.comparepass(req.body.password);
    if(!match){
        return res.status(400).json({msg:"incorrect email or password"})
    }
    const token=generateToken(user)
    res.cookie("jwt",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:1*24*60*60*1000
    })
    res.status(200).json({success:true,data:user})
})
const logout =(req, res) => {
    const {cookies} = req;
    if (!cookies || !cookies.jwt) return res.sendStatus(204); 
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
    res.json({ msg: 'logged out'});

 }

 const checkAuthentication=async(req,res)=>{
    return res.status(200).json({success:true,data:req.user})
 }
 module.exports={signup,login,logout,checkAuthentication}