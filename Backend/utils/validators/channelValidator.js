const {check} = require('express-validator');
const Channel = require('../../models/channel.model');
const validate= require('../../middlewares/validation');

const createChannelRules=[
    check("name").notEmpty().withMessage("channel name is required").isLength({ min: 2 }).withMessage("channel name must be at least 2 characters").custom(async(val)=>{
        const channel = await Channel.findOne({name:val});
        if(channel){
           throw new Error("channel name already in use ");
        }   
    })]
module.exports={createChannelRules}    