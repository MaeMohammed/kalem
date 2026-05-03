const Channel = require('../models/channel.model');
const ChannelMsg = require('../models/channelMsg.model');
const asyncHandler = require('express-async-handler');
const { io } = require('../utils/socket');


const getChannels =asyncHandler(async(req,res)=>{
  const channels = await Channel.find({}).populate("members","username profileIMG")
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
const joinChannel=asyncHandler(async(req,res)=>{
    const channel= await Channel.findById(req.params.channelId)
    if(!channel) return res.status(404).json({success:false,msg:"this channel doesnt exist"})
    if(channel.members.includes(req.user._id)) return res.status(400).json("you are already a member of this channel")
    channel.members.push(req.user._id)
    await channel.save()
    return res.status(200).json({success:true,data:channel})
})
const getChannelMessages=asyncHandler(async(req,res)=>{
    const channel=await Channel.findById(req.params.channelId);
    if(!channel) return res.status(404).json({success:false,msg:"this channel is not found"})
    const member=channel.members.some(id=> id.toString() === req.user._id.toString())
    if(!member) return res.status(400).json({success:false,msg:"you are not a member of this channel,please join first"})
    const messages= await ChannelMsg.find({channelId:channel._id}).populate("sender","username profileIMG")
    return res.status(200).json({success:true,data:messages})
})
const sendChannelMessage=asyncHandler(async(req,res)=>{
    const channel=await Channel.findById(req.params.channelId);
    if(!channel) return res.status(404).json({success:false,msg:"this channel is not found"})
    const member=channel.members.some(id=> id.toString() === req.user._id.toString())
    if(!member) return res.status(400).json({success:false,msg:"you are not a member of this channel,please join first"})
    const message= await ChannelMsg.create({
        channelId:channel,
        sender:req.user._id,
        message :req.body.message
    })
    const populatedMessage=await message.populate("sender","username profileIMG")
    io.to(channel._id.toString()).emit("newChannelMessage",populatedMessage)
    return res.status(201).json({success:true,data:populatedMessage})
})
module.exports={getChannels,createChannel,getChannelMessages,sendChannelMessage,joinChannel}