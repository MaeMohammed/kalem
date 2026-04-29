const express=require("express")
const {upload}=require("../utils/cloudinary")
const router=express.Router()
const verifyToken=require("../middlewares/verify")
const {getusers, updateProfile}=require("../controllers/user.controller")
const {updateProfileRules}=require("../utils/validators/profileValidator")
router.route("/").get(verifyToken,getusers)
router.route("/update-profile").put(verifyToken,upload.single("profileIMG"),updateProfileRules,updateProfile)

module.exports=router
