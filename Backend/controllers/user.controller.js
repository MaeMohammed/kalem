const User=require("../models/user.model")
const asyncHandler=require("express-async-handler")

const getusers=asyncHandler(async(req,res)=>{
    const users=await User.find({_id:{$ne:req.user._id}}).select("-password")
    return res.status(200).json({success:true, data: users})
})
module.exports={getusers}