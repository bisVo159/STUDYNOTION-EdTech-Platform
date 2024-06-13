const Profile=require('../models/Profile')
const User=require('../models/User')
const Course=require('../models/Course')
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")

exports.updateProfile=async(req,res)=>{
    try {
        // get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body
        // get userId
        const id=req.user.id
        // validation
        // if(!contactNumber||!gender||!id){
        //     return res.status(400).json({
        //         success:false,
        //         message:"All fields are required"
        //     })
        // }
        // find profile
        const userDetails=await User.findById(id)
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId)
        // update Profile
        profileDetails.dateOfBirth=dateOfBirth
        profileDetails.about=about
        profileDetails.gender=gender
        profileDetails.contact=contactNumber
        await profileDetails.save()
        // return response
        return res.status(200).json({
            success:true,
            message:`${userDetails.firstName}'s details updated successfully`,
            updatedUserDetails:profileDetails
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

// deleteAccount
// Explore - > How can we shedule this deletion operation (cron job)
exports.deleteAccount=async(req,res)=>{
    try {
        // get id
        const id=req.user.id
        // validation
        const userDetails=await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // delete profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
        // TODO : unenroll user from all enrolled course - done
        const enrolledCourses=userDetails.courses
        for(let i in enrolledCourses ){
            let course = await Course.findOneAndUpdate({_id:enrolledCourses[i]},{
                                                                $pull:{studentsEnrolled:id}
                                                            },{new:true})
        }
        // delete user
        await User.findByIdAndDelete(id)
        // return response
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:'User cannot be deleted successfully'
        })
    }
}


exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path:"courses",
          populate:{
            path: "courseContent",
              populate: {
                path: "subSection",
              },
          }
        })
        .exec()

        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          let courseProgressCount = await CourseProgress.findOne({
            courseId: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                ((courseProgressCount * multiplier)/ SubsectionLength) * 100 
              ) / multiplier
          }
        }

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard=async(req,res)=>{
  try {
    const courseDetails=await Course.find({Instructor:req.user.id})

    const courseData=courseDetails.map((course)=>{
      const totalStudentsEnrolled=course.studentsEnrolled.length
      const totalAmountGenerated=course.price*totalStudentsEnrolled

      // create a new field with additional fields
      const courseDetailsWithStats={
        _id:course._id,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated
      }

      return courseDetailsWithStats;
    })

    return res.status(200).json({
      success:true,
      courses:courseData
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}