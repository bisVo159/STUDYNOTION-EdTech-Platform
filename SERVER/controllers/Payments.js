const {instance}=require('../config/razorpay')
const Course=require('../models/Course')
const User=require('../models/User')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollmentEmail')
const { default: mongoose } = require('mongoose')
const crypto=require('crypto')
const {paymentSuccessEmail}=require('../mail/templates/paymentSuccessEmail')
const CourseProgress = require('../models/CourseProgress')

exports.capturePayment=async(req,res)=>{
    const {courses}=req.body;
    const userId=req.user.id

    if(courses.length===0){
        return res.json({
            success:false,
            message:"Please provide valid course id"
        })  
    }

    let totalAmount=0;

    for(const course_id of courses){
        let course;
        try {
            course=await Course.findById(course_id)
            if(!course){
                return res.status(404).json({success:false,message:"Could not find the course"})
            }

            const uid=new mongoose.Types.ObjectId(userId)
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({success:false,message:"Student is already enrolled"})
            }
            totalAmount+=course.price;
        } catch (error) {
            console.log(error)
            return res.status(500).json({success:false,message:error.message})
        }
    }

    const currency="INR"
    const options={
        amount:totalAmount*100,
        currency,
        receipt:Math.random(Date.now()).toString()
    }

    try {
    // initiate payment using razorpay
    const paymentResponse=await instance.orders.create(options)
    console.log(paymentResponse)
    // return response
    return res.status(200).json({
        success:true,
        message:"order Created",
        data:paymentResponse
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Could not initiate payment"
    })
}
}

// verify the payment
exports.verifyPayment=async(req,res)=>{
    const razorpay_order_id=req.body?.razorpay_order_id
    const razorpay_payment_id=req.body?.razorpay_payment_id
    const razorpay_signature=req.body?.razorpay_signature

    const courses=req.body?.courses
    const userId=req.user.id

    if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!courses||!userId){
        return res.status(200).json({
            success:false,
            message:"Payment failed"
        })
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString()).digest("hex");
    console.log("expectedSignature ",expectedSignature)
    console.log("razorpay_signature ",razorpay_signature)

    if(expectedSignature===razorpay_signature){
        // enroll student
        await enrollStudent(courses,userId,res)
        // return response
        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }
    return res.status(200).json({
        success:false,
        message:"Payment failed"
    })
}

const enrollStudent=async(courses,userId,res)=>{
    if(!courses||!userId){
        return res.status(400).json({success:false,message:"Please provide data for UserId and Courses"})
    }

    for(let courseId of courses){
        try {
            const enrolledCourse=await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true}
            )
            if(!enrolledCourse){
                return res.status(500).json({success:false,message:"Course not found"})
            }

             const courseProgress=await CourseProgress.create({courseId,userId,completedVideos:[]});

            // find the user student and enroll the courses to their list of enroll courses
            const enrolledStudent=await User.findByIdAndUpdate(
                userId,
                {$push:{
                    courses:courseId,
                    courseProgress:courseProgress._id
                }
                },
                {new:true}
            )
    
            // mail send to student
            const emailResponse=await mailSender(
                enrollStudent.email,`Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`enrolledStudent.firstName enrolledStudent.lastName`)
            )
            console.log("Email sent successfully ",emailResponse);
        } catch (error) {
            console.log(error)
            return res.status(500).json({success:false,message:error.message})
        }
    }
}

exports.sendPaymentSuccessEmail=async(req,res)=>{
    const {orderId,paymentId,amount}=req.body;
    const userId=req.user.id

    if(!orderId||!paymentId||!amount||!userId){
        return res.status(400).json({success:false,message:"Please provide all the fields"})
    }

    try {
        const enrolledStudent=await User.findById(userId)
        await mailSender(enrolledStudent.email,
            "Payment received",
            paymentSuccessEmail(enrolledStudent.firstName,amount/100,orderId,paymentId))
    } catch (error) {
        console.log("Error in sending mail",error)
        return res.status(400).json({success:false,message:"Could not send email"})
    }
}

// capture the payment and initiate the razorpay payment
// exports.capturePayment=async(req,res)=>{
//         // get userId and courseId
//         const {course_id}=req.body
//         const userId=req.user.id
//         // validation
//         // valid courseId
//         if(!course_id){
//             return res.json({
//                 success:false,
//                 message:"Please provide valid course id"
//             })
//         }
//         // valid courseDetails
//         let course;
//         try {
//             course=await Course.findById(course_id)
//             if(!course){
//                 return res.json({
//                     success:false,
//                     message:"Could not find any course"
//                 })
//             }

//             // user already pay for the same course
//             const uid=new mongoose.Types.ObjectId(userId)
//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(200).json({
//                     success:false,
//                     message:"Student is already enrolled"
//                 })
//             }
//         } catch (error) {
//             console.log(error)
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//         // order create
//         const amount=course.price
//         const currency="INR"
//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId:course_id,
//                 userId
//             }
//         }

//         try {
//             // initiate payment using razorpay
//             const paymentResponse=await instance.orders.create(options)
//             console.log(paymentResponse)
//             // return response
//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentResponse.id,
//                 amount:paymentResponse.amount,
//                 currency:paymentResponse.currency,
//             })
//         } catch (error) {
//             console.log(error)
//             return res.json({
//                 success:false,
//                 message:"Could not initiate payment"
//             })
//         }
     
//     } 


    // verify signature of Razorpay and server
    // exports.verifySignature=async(req,res)=>{
    //     const webhookSecret="12345678"
    //     const signature=req.header("x-razorpay-signature")
        
    //     // sha256 is a hashing algo
    //     // HW
    //     const shasum=crypto.createHmac("sha256",webhookSecret)
    //     shasum.update(JSON.stringify(req.body))
    //     const digest=shasum.digest('hex')
    
    //     if(signature===digest){
    //         console.log("Payment is authorised")
    
    //         const {userId,courseId}=req.body.payload.payment.entity.notes

    //             try{
    //                 // full fill the action
            
    //                 // find the course and enroll the student in it
    //                 const enrolledCourse=await Course.findByIdAndUpdate({_id:courseId},
    //                                                                                     {
    //                                                                                         $push:{studentsEnrolled:userId}
    //                                                                                     },
    //                                                                                     {new:true})
            
    //                 if(!enrolledCourse){
    //                     return res.status(500).json({
    //                         success:false,
    //                         message:"Course not found"
    //                     })
    //                 }
            
    //                 console.log(enrolledCourse)
            
    //                 // find the student and add the course to their list of enrolled course
    //                 const enrolledStudent=await User.findByIdAndUpdate(
    //                                                                                 {_id:userId},
    //                                                                                 {
    //                                                                                     $push:{courses:courseId}
    //                                                                                 },
    //                                                                                 {new:true})
            
    //                 console.log(enrolledStudent)  
            
    //                 // send confirmation mail
    //                 const emailResponse=await mailSender(
    //                                                                     enrolledStudent.email,
    //                                                                     "Congratulations from studyNotion",
    //                                                                     "Congratulations, You are onboarded into new studyNotion course")

    //                 console.log(emailResponse)
    //                 return res.status(200).json({
    //                     success:true,
    //                     message:"Signature varified and course added to your dashboard"
    //                 })
    //             } catch (error) {
    //                 console.log(error)
    //                 return res.status(500).json({
    //                     success:false,
    //                     message:error.message
    //                 })
    //             }
    //     }
    //     else{
    //         return res.status(400).json({
    //             success:false,
    //             message:"Invalid request"
    //         })
    //     }
    
    // }