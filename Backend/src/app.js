const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const connectDB=require("../config/db")
const cors=require("cors")
const authRouter=require("../routes/auth.route")
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
origin:"http://localhost:5174",
credentials:true
}))
dotenv.config()
connectDB()

app.use("/api/auth",authRouter)
mongoose.connection.once("open",()=>{
    console.log(`connected to mongodb succesfully`)
    app.listen(process.env.PORT,()=>console.log(`app is running on port ${process.env.PORT}`))
})