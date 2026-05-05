const Message=require("../models/message.model")
const asyncHandler=require("express-async-handler");
const { getReceiverSocketId, io, usersocketMap } = require("../utils/socket");
const { cloudinary } = require("../utils/cloudinary");

const getMessages=asyncHandler(async(req,res)=>{
    const {id:theOtherUser}=req.params;
    const current_user=req.user._id;
    const messages= await Message.find({$or:[
        {sender:current_user, reciver:theOtherUser},
        {sender:theOtherUser, reciver:current_user}
    ]})
    return res.status(200).json({success:true,data:messages})
})
const sendMessage=asyncHandler(async(req,res)=>{
    const {id:theOtherUser}=req.params;
    const current_user=req.user._id;
    let image;
            if(req.file){
                const b64=Buffer.from(req.file.buffer).toString("base64")
                const datauri=`data:${req.file.mimetype};base64,${b64}`
                image=(await cloudinary.uploader.upload(datauri,{
                    folder:"kalem/images"
                })).secure_url
            }
    const newMessage= await Message.create({
        sender:current_user,
        reciver:theOtherUser,
        message:req.body.message,
        image:image
    })
    const receiverSocketId=getReceiverSocketId(theOtherUser)
    
    console.log("receiver id:", theOtherUser)
    console.log("receiver socket id:", receiverSocketId)
     console.log("all connected users:", usersocketMap)
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    return res.status(201).json({success:true,data:newMessage})
})
module.exports={getMessages,sendMessage}
    