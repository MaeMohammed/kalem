const Channel = require('../models/channel.model');
const ChannelMsg = require('../models/channelMsg.model');
const asyncHandler = require('express-async-handler');
const { io } = require('../utils/socket');
const { cloudinary } = require('../utils/cloudinary');
const APIERROR = require('../utils/errorClass');


const getChannels =asyncHandler(async(req,res)=>{
  const channels = await Channel.find({}).populate("members createdBy","username profileIMG")
  return  res.status(200).json({success:true,data:channels})
})

const createChannel =asyncHandler(async(req,res)=>{
   
    const channel=await Channel.create({
        name:req.body.name,
        description:req.body.description,
        createdBy:req.user._id,
        members:[req.user._id]
    })
    const populatedChannel=await Channel.findById(channel._id).populate("members createdBy","username profileIMG")
   return res.status(201).json({success:true,data:populatedChannel})
})
const joinChannel=asyncHandler(async(req,res)=>{
    const channel= await Channel.findById(req.params.channelId).populate("members createdBy","username profileIMG")
    if(!channel) return next(new APIERROR("this channel is not found",404))
    if(channel.members.includes(req.user._id)) return next(new APIERROR("you are already a member of this channel ",400))
    channel.members.push(req.user._id)
    await channel.save()
    return res.status(200).json({success:true,data:channel})
})
const getChannelMessages=asyncHandler(async(req,res)=>{
    const channel=await Channel.findById(req.params.channelId);
    if(!channel) return next(new APIERROR("this channel is not found",404))
    const member=channel.members.some(id=> id.toString() === req.user._id.toString())
    if(!member) return res.status(400).json({success:false,msg:"you are not a member of this channel,please join first"})
    const messages= await ChannelMsg.find({channelId:channel._id}).populate("sender","username profileIMG")
    return res.status(200).json({success:true,data:messages})
})
const sendChannelMessage=asyncHandler(async(req,res,next)=>{
    const channel=await Channel.findById(req.params.channelId);
    if(!channel) return res.status(404).json({success:false,msg:"this channel is not found"})
    const member=channel.members.some(id=> id.toString() === req.user._id.toString())
    if(!member) return next(new APIERROR("you are not a member of this channel,please join first",400))
        let image;
        if(req.file){
            const b64=Buffer.from(req.file.buffer).toString("base64")
            const datauri=`data:${req.file.mimetype};base64,${b64}`
            image=(await cloudinary.uploader.upload(datauri,{
                    folder:"kalem/images"
                })).secure_url
            }   
    const message= await ChannelMsg.create({
        channelId:channel,
        sender:req.user._id,
        message :req.body.message,
        image:image
    })
    const populatedMessage=await message.populate("sender","username profileIMG")
    io.to(channel._id.toString()).emit("newChannelMessage",populatedMessage)
    return res.status(201).json({success:true,data:populatedMessage})
})
const leaveChannel=asyncHandler(async(req,res,next)=>{
    const channel= await Channel.findById(req.params.channelId)
    if(!channel){
        return next(new APIERROR("this channel is not found",404))
    }
    const isMember=channel.members.some(m => m.toString() === req.user._id.toString())
     if(!isMember){
        return next(new APIERROR("you are not a member of this channel",400))
    }
    channel.members=channel.members.filter(m => m.toString() !== req.user._id.toString())
    await channel.save()
    return res.status(200).json({success:true,data:channel})
})

module.exports={getChannels,createChannel,getChannelMessages,sendChannelMessage,joinChannel,leaveChannel}