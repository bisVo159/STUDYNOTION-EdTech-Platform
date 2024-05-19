const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const bcrypt=require('bcrypt')
const crypto=require('crypto')

// resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{
    try {
        // get email from req body
        const email=req.body.email;
        // check user for this email, user validation
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Email not found"
            })
        }
        // generate token
        const token=crypto.randomUUID()
        // update user by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate(
                                                            {email:email},
                                                            {
                                                                token:token,
                                                                resetPasswordExpires:Date.now()+5*60*1000
                                                            },
                                                            {
                                                                new:true      // return updated one
                                                            })
        // create url
        const url=`http://localhost:3000/update-password/${token}`
        // send mail containing the url
        await mailSender(email,
                                        "Reset Password",
                                        `Click on below link to change your password\n${url}`)
        // return response
        return res.json({
            success:true,
            message:"Email sent successfully, please check email and change password"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong while sending reset password"
        })
    }
}


// resetPassword
exports.resetPassword=async(req,res)=>{
    try {
        // data fetch
        const {password,confirmPassword,token}=req.body
        // validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        }
        // get userdetails from db using token
        const userdetails=await User.findOne({token:token})
        // if no entry - invalid token
        if(!userdetails){
            return res.json({
                success:false,
                message:"Invalid Token"
            })
        }
        // token time check
        if(userdetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token expired , please regenerate your token"
            })
        }
        // hash pwd
        const hashedPassword=await bcrypt.hash(password,10)

        // password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )
        // return response
        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong while sending reset password"
        })
    }
}