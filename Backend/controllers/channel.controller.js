const Channel = require('../models/channel.model');
const ChannelMsg = require('../models/channelMsg.model');
const asyncHandler = require('express-async-handler');


const getChannels =asyncHandler(async(req,res)=>{
  const channels = await Channel.find({})
  return  res.status(200).json({success:true,data:channels})
})

const createChannel =asyncHandler(async(req,res)=>{
   
    const channel=await Channel.create({
        name:req.body.name,
        description:req.body.description,
        createdBy:req.user._id,
        members:[req.user._id]
    })
   return res.status(201).json({success:true,data:channel})
})
const getChannelMessages=asyncHandler(async(req,res)=>{
    const channel=req.params.channelId;
    const messages= await ChannelMsg.find({channelId:channel}).populate("sender","username")
    return res.status(200).json({success:true,data:messages})
})
const sendChannelMessage=asyncHandler(async(req,res)=>{
    const channel=req.params.channelId;
    const message= await ChannelMsg.create({
        channelId:channel,
        sender:req.user._id,
        message :req.body.message
    })
    return res.status(201).json({success:true,data:message})
})
module.exports={getChannels,createChannel,getChannelMessages,sendChannelMessage}