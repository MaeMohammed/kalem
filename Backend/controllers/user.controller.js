const User=require("../models/user.model")
const asyncHandler=require("express-async-handler")
const { cloudinary } = require("../utils/cloudinary")

const getusers=asyncHandler(async(req,res)=>{
    const users=await User.find({_id:{$ne:req.user._id}}).select("-password")
    return res.status(200).json({success:true, data: users})
})

const updateProfile=asyncHandler(async(req,res)=>{       
        let profileIMG;
        if(req.file){
            const b64=Buffer.from(req.file.buffer).toString("base64")
            const datauri=`data:${req.file.mimetype};base64,${b64}`
            profileIMG=(await cloudinary.uploader.upload(datauri,{
                folder:"kalem/profile"
            })).secure_url
        }
        const user=await User.findByIdAndUpdate(req.user._id, { ...(profileIMG && { profileIMG: profileIMG }), ...(req.body?.bio && { bio: req.body.bio }) }, { new: true }).select("-password")
        return res.status(200).json({success:true, data: user})
   
})
module.exports={getusers, updateProfile}