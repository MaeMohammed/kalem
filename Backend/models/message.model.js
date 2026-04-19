const mongoose=require("mongoose")
const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
},{timestamps:true})

module.exports=mongoose.model("Message",messageSchema)