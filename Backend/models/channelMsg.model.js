const mongoose = require("mongoose");

const channelMsgSchema = new mongoose.Schema({
    channelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Channel",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true ,
    },
    message:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
},{timestamps:true})
    
module.exports=mongoose.model("ChannelMsg",channelMsgSchema)