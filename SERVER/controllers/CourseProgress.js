const CourseProgress = require("../models/CourseProgress")
const SubSection = require("../models/SubSection")


exports.updateCourseProgress=async(req,res)=>{
    const {courseId,subSectionId}=req.body
    const userId=req.user.id

    try {
        const subSection=await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({success:false,error:"Invalid SubSection"})
        }

        let courseProgress=await CourseProgress.findOne(
            {
                courseId,userId
            }
        )
        if(!courseProgress){
            return res.status(404).json({
                success:false,
                error:"Course Progress does not exist"
            })
        }else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success:false,
                    error:"Subsection is already completed"
                })
            }

        // push into completed video
        courseProgress.completedVideos.push(subSectionId);
        await courseProgress.save()
        }
        return res.status(200).json({
            success:true,
            message:"Lecture Marked As Completed"
        })
    } catch (error) {
        console.error(error)
        return res.status(400).json({success:false,error:"Internal Server Error"})
    }
}
