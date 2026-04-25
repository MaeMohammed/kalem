const express=require("express")
const verifyToken = require("../middlewares/verify")
const { getMessages, sendMessage } = require("../controllers/directMessages.controller")
const router=express.Router()

router.route("/:id/messages").get(verifyToken,getMessages).post(verifyToken,sendMessage)

module.exports=router
