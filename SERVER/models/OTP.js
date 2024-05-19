const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:new Date(Date.now()+60 * 5*1000), // The document will be automatically deleted after 5 minutes of its creation time
    }
})

// a function to send email
async function sendVarificationEmail(email,otp) {
    try {
        const mailReceiver=await mailSender(email,"varification otp from studyNotion",emailTemplate(otp))
        console.log("Email sent successfully: ",mailReceiver)
    } catch (error) {
        console.log("Error occurs while sending mail ",error)
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVarificationEmail(this.email,this.otp);
    next();
})

module.exports=mongoose.model('OTP',OTPSchema)