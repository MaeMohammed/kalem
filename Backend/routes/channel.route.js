const express= require("express")
const { getChannels, createChannel } = require("../controllers/channel.controller")
const verifyToken = require("../middlewares/verify")

const router=express.Router()

router.route('/').get(verifyToken, getChannels).post(verifyToken,createChannel)

module.exports=router