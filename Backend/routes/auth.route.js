const express = require("express");


const router=express.Router()
const{signup,login,logout, checkAuthentication}=require("../controllers/auth.controller")
const {signupRules,loginRules}=require("../utils/validators/authValidator");
const verifyToken = require("../middlewares/verify");

router.route("/signup").post(signupRules, signup)
router.route("/login").post(loginRules, login)
router.route("/logout").post(logout)
router.route("/checkauth").get(verifyToken, checkAuthentication)

module.exports=router