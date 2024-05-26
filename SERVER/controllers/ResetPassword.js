const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const bcrypt=require('bcrypt')
const crypto=require('crypto')

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};


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