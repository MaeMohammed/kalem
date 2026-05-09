require("colors")
const globalHandler=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status || "error"

    console.log(err.message.yellow)
    if(process.env.NODE_ENV==="development"){
        console.log(err.stack.gray)
        devError(err,res)
    } else if(process.env.NODE_ENV==="production"){
        prodError(err,res)
    }
}
const devError=(err,res)=>{
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack
    })
}
const prodError=(err,res)=>{
  return res.status(err.statusCode).json({
    message:err.message,
    status:err.status
  })
}
module.exports=globalHandler;