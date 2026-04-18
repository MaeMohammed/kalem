const mongoose=require("mongoose")

const connnectDB=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (error) {
        console.log("an error occurred when connecting to mongoDB",error)
    }
}
module.exports=connnectDB