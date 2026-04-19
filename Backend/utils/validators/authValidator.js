const {check} = require('express-validator');
const User = require('../../models/user.model');
const validate= require('../../middlewares/validation');

const signupRules=[
    check("username").notEmpty().withMessage("username is required").isLength({ min: 2, max: 32 }).withMessage("username must be between 2 and 32 characters").custom(async(val)=>{
        const user = await User.findOne({username:val});
        if(user){
           throw new Error("username already in use ");
        }
    }),
    check("email").notEmpty().withMessage("email is required").isEmail().normalizeEmail().withMessage("wrong email format").custom(async(val)=>{
        const user = await User.findOne({email:val});
        if(user){
           throw new Error("email already exists");
        }
    })
         
    ,check("password").notEmpty().withMessage("password is required").isLength({ min: 8 }).withMessage("password must be at least 8 characters")
    ,
    validate
]
const loginRules=[  
    check("email").notEmpty().withMessage("email is required").isEmail().normalizeEmail().withMessage("wrong email format"),
    check("password").notEmpty().withMessage("password is required").isLength({ min: 8 }).withMessage("password must be at least 8 characters")
    ,
    validate
]
module.exports={signupRules,loginRules}