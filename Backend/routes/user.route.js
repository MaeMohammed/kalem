const express=require("express")
const router=express.Router()
const verifyToken=require("../middlewares/verify")
const {getusers}=require("../controllers/user.controller")

router.route("/").get(verifyToken,getusers)

module.exports=router
