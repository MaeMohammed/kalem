const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please enter a username"],
        unique:[true,"this username is already in use"],
        trim:true
    },
    email:{
        type:String,
        unique:[true,"this email is already in use"],
        required:[true,"please enter a valid email address"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"please enter a password"],
        trim:true,
        minlength:[8,"password must atleast be 8 characters long"]
    },
    profileIMG:{
        type:String,
        optional:true
    },
    bio:{
        type:String,
        optional:true
    }
},{timestamps:true})
userSchema.pre("save",async function(){
  if(!this.isModified("password")) return
  this.password= await bcrypt.hash(this.password,12)
  return;
})
userSchema.methods.comparepass= async function(pass){
    return await bcrypt.compare(pass,this.password);
}
userSchema.methods.toJSON=function(){
    const userObj=this.toObject();
    delete userObj.password
    return userObj;
}
module.exports=mongoose.model("User",userSchema)