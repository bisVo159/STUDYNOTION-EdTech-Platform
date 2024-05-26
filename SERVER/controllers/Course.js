const Course=require('../models/Course')
const Category=require('../models/Category')
const User=require('../models/User')
const {uploadImageToCloudinary}=require('../utils/imageUploader')


// createCourse handler function
exports.createCourse=async(req,res)=>{
    try {
        // fetch data
        let {courseName,courseDescription,whatWillYouLearn,price,tag,category,status}=req.body;

        // get thumbnail
        const thumbnail=req.files.thumbnailImage

        // validation
        if(!courseName||!courseDescription||!whatWillYouLearn||!price||!category||!thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if (!status || status === undefined) {
			status = "Draft";
		}

        // check for instructor
        let instructorDetails = await User.findById(req.user.id);
        console.log("Instructor Details: ",instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found"
            })
        }

        // check given tag is valid or not
        let categoryDetails=await Category.findById(category)

        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"category details not found"
            })
        }

        // upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        // create an entry  for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            Instructor:instructorDetails._id,
            whatWillYouLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status
        })

        // add the new course to the user schema of instructor
        await User.findOneAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{courses:newCourse._id}
            },
            {new:true}
        )

        // update the tag schema
        await Category.findOneAndUpdate(
            {_id:categoryDetails._id},
            {
                $push:{courses:newCourse._id}
            },
            {new:true}
        )

        // return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to create course"
        })
    }
}

// getAllCourses handler function
exports.showAllCourses=async(req,res)=>{
    try {
        const allCourses=await Course.find({},{courseName:true,
                                                                                price:true,
                                                                                thumbnail:true,
                                                                                Instructor:true,
                                                                                ratingAndReviews:true,
                                                                                studentsEnrolled:true})
                                                                                .populate('Instructor')
                                                                                .exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses
        })                               
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:error.message
        })
    }
}


// getCourseDetails
exports.getCourseDetails=async(req,res)=>{
    try {
        // get id
        const {courseId}=req.body
        // find course details
        const coursedetails=await Course.find({_id:courseId})
                                                        .populate(
                                                            {
                                                                path:'Instructor',
                                                                populate:{
                                                                    path:'additionalDetails'
                                                                }
                                                            }
                                                        )
                                                        .populate(
                                                            {
                                                                path:'courseContent',
                                                                populate:{
                                                                    path:'subSection'
                                                                }
                                                            }
                                                        )
                                                        .populate('ratingAndReviews')
                                                        .populate('category')
                                                        .exec()

        // validation
        if(!coursedetails){
            return res.status(400).json({
                successaa:false,
                message:`Could not find any course with courseId ${courseId}`
            })
        }

        // return response
        return res.status(200).json({
            successaa:true,
            message:'Course details fetched successfully',
            data:coursedetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            successaa:false,
            message:error.message
        })
    }
}