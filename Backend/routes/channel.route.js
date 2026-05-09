const express= require("express")
const { getChannels, createChannel, getChannelMessages, sendChannelMessage, joinChannel, leaveChannel } = require("../controllers/channel.controller")
const verifyToken = require("../middlewares/verify")
const {createChannelRules, joinChannelRules}=require("../utils/validators/channelValidator")
const { upload } = require("../utils/cloudinary")
const router=express.Router()

router.route('/').get(verifyToken, getChannels).post(verifyToken,createChannelRules,createChannel)
router.route('/:channelId/messages').get(verifyToken,getChannelMessages).post(verifyToken,upload.single("image"),sendChannelMessage)
router.route('/:channelId/join').patch(verifyToken,joinChannelRules,joinChannel)
router.route('/:channelId/leave').patch(verifyToken,leaveChannel)
module.exports=router