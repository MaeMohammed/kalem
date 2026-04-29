const express= require("express")
const { getChannels, createChannel, getChannelMessages, sendChannelMessage } = require("../controllers/channel.controller")
const verifyToken = require("../middlewares/verify")
const {createChannelRules}=require("../utils/validators/channelValidator")
const router=express.Router()

router.route('/').get(verifyToken, getChannels).post(verifyToken,createChannelRules,createChannel)
router.route('/:channelId/messages').get(verifyToken,getChannelMessages).post(verifyToken,sendChannelMessage)
module.exports=router