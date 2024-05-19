const User=require('../models/User')
const OTP=require('../models/OTP')
const otpGenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const Profile=require('../models/Profile')
const jwt=require('jsonwebtoken')
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require('dotenv').config()

// sendOTP
exports.sendOTP=async(req,res)=>{
    try {
        const {email}=req.body

        // check if user already present
        let checkUserpresent = await User.findOne({ email})

        // if user already present return a response
        if(checkUserpresent){
            return res.status(401).json({
                successs:false,
                message:"User already resistered"
            })
        }

        // generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        console.log("OTP generated ",otp)

        // check unique otp or not
        let result=await OTP.findOne({otp})
 
        // improve it later
        while (result) {
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result=await OTP.findOne({otp})
        }

        const otpPayload={email,otp}

        // create an entry for OTP
        const otpBody=await OTP.create(otpPayload)
        console.log("otpBody ",otpBody)

        // return successfull response
        return res.status(200).json({
            successs:true,
            message:"OTP sent successfully",
            otp
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            successs:false,
            message:error.message
        })
    }
}


// signUp
exports.signUp=async(req,res)=>{
    try {
        // data fetch from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body
        // validation
        if(!firstName||!lastName||!email||!password||!confirmPassword
            ||!otp){
                return res.status(403).json({
                    successs:false,
                    message:"All field required"
                })
            }
        // 2 password match
        if(password!==confirmPassword){
            return res.status(400).json({
                successs:false,
                message:"Password not matched, please try again"
            })
        }
        // check user already exist or not
        let existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                successs:false,
                message:"User is already resistered"
            })
        }

        // find most recent otp stored for the user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1)
        console.log("otp body : ",recentOtp)
        // validate OTP
        if(recentOtp.length===0){
            return res.status(400).json({
                successs:false,
                message:"OTP not found"
            })
        }else if(otp!=recentOtp[0].otp){
            return res.status(400).json({
                successs:false,
                message:"Invalid OTP"
            })
        }

        // Hash password
        const hashPassword=await bcrypt.hash(password,10)

        // entry create in db
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contact:null
        })
        
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        // return rtesponse
        return res.status(200).json({
            successs:true,
            message:"User is registered successfully",
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            successs:false,
            message:"User cannot be registered, Please try again"
        })
    }
}

// logIn
exports.logIn = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email }).populate("additionalDetails");

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.SECRET_KEY,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};


// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};