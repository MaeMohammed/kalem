const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")
const asyncHandler = require("express-async-handler")

const verifyToken = asyncHandler(async (req, res, next) => {
    
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ msg: "you are not authorized to access this route" })
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }
    catch (err) {
        return res.status(401).json({ msg: "Unauthorized access" })
    }

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
        return res.status(401).json({ msg: "user doesnt exist" })
    }
    req.user = user
    next()
})


module.exports = verifyToken;