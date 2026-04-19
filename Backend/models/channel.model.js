const mongoose = require("mongoose")

const channelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter a channel name"],
        unique:true
    },
    description:{
        type:String
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})


module.exports=mongoose.model("Channel",channelSchema)