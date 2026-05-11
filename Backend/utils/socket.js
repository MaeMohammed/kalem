const { Server }=require("socket.io")
const http=require("http")
const express=require("express")
const Channel=require("../models/channel.model")

const app=express()

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"*"
    }
})
const getReceiverSocketId=(userId)=>{
  return usersocketMap[userId]
}
const usersocketMap={}

io.on("connection",async(socket)=>{



 const userId=socket.handshake.query.userId;
 
 if(userId){
    usersocketMap[userId]=socket.id
    const channels= await Channel.find({members:userId})
    channels.forEach(channel=>{
            socket.join(channel._id.toString())})
    
    }
 
 io.emit("getOnlineUsers",Object.keys(usersocketMap))

 socket.on("disconnect",()=>{

    delete(usersocketMap[userId])
     io.emit("getOnlineUsers",Object.keys(usersocketMap))
 })
 socket.on("joinChannel",(channelId)=>{
    socket.join(channelId)
 })
})
module.exports={app,io,server,getReceiverSocketId,usersocketMap}