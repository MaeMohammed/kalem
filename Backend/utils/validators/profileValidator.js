const User=require("../../models/user.model")
const validate= require('../../middlewares/validation');
const {check} = require('express-validator');

const updateProfileRules=[
    check("bio").optional().isLength({max:200}).withMessage("bio is too long must be less than 200 charcters long")
]
module.exports={updateProfileRules}