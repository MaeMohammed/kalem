const { Server }=require("socket.io")
const http=require("http")
const express=require("express")
const { channel } = require("diagnostics_channel")

const app=express()

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173"
    }
})
const getReceiverSocketId=(userId)=>{
  return usersocketMap[userId]
}
const usersocketMap={}

io.on("connection",(socket)=>{

 console.log("a user connected",socket.id)

 const userId=socket.handshake.query.userId;
 if(userId) usersocketMap[userId]=socket.id
 
 io.emit("getOnlineUsers",Object.keys(usersocketMap))

 socket.on("disconnect",()=>{
    console.log("a user disconnected",socket.id)
    delete(usersocketMap[userId])
     io.emit("getOnlineUsers",Object.keys(usersocketMap))
 })
 socket.on("joinChannel",(channelId)=>{
    socket.join(channelId)
 })
})
module.exports={app,io,server,getReceiverSocketId,usersocketMap}