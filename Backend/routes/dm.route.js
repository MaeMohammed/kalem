const express=require("express")
const verifyToken = require("../middlewares/verify")
const { getMessages, sendMessage } = require("../controllers/directMessages.controller")
const { upload } = require("../utils/cloudinary")
const router=express.Router()

router.route("/:id/messages").get(verifyToken,getMessages).post(verifyToken,upload.single("image"),sendMessage)

module.exports=router
