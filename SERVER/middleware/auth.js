const jwt=require('jsonwebtoken')
require('dotenv').config()
const User=require('../models/User')

// auth
exports.auth=async(req,res,next)=>{
    try {
        // extract token
        const token=req.cookies.token
                                        || req.body
                                        || req.header("Authorization").replace("Bearer","")

        // if token missing return the response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }

        // verify the token
        try {
            let decoded = jwt.verify(token,process.env.SECRET_KEY)
            console.log(decoded)
            req.user=decoded
        } catch (error) {
            // verification - issue
            return res.status(401).json({
                success: false,
                message:"Token is invalid"
            })
        }
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:"Something went wrong while validating the token"
        })
    }
}


// isStudent
exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for students only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, Please try again"
        })
    }
}

// isInstructor
exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for Instructor only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, Please try again"
        })
    }
}

// isAdmin
exports.isAdmin=async(req,res,next)=>{
    try {
        console.log("admin", req.user);
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for Admin only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, Please try again"
        })
    }
}