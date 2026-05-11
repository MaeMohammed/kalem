const express=require("express")
const dotenv=require("dotenv")
dotenv.config()
const mongoose=require("mongoose")
const connectDB=require("../config/db")
const cors=require("cors")
const authRouter=require("../routes/auth.route")
const channelrouter=require("../routes/channel.route")
const userRouter=require("../routes/user.route")
const dmRouter=require("../routes/dm.route")
const {app,io,server}=require("../utils/socket")

const cookieParser=require("cookie-parser")
const globalHandler = require("../middlewares/error")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(globalHandler)
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

connectDB()

app.use("/api/auth",authRouter)
app.use("/api/channels",channelrouter)
app.use("/api/users",userRouter)
app.use("/api/dm",dmRouter)

mongoose.connection.once("open",()=>{
    console.log(`connected to mongodb succesfully`)
    server.listen(process.env.PORT,()=>console.log(`app is running on port ${process.env.PORT}`))
})