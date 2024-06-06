const Course=require('../models/Course')
const Section=require('../models/Section')
const SubSection = require('../models/SubSection')

exports.createSection=async(req,res)=>{
    try {
        // data fetch
        const {sectionName,courseId}=req.body
        // validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        // create section
        const newSection=await Section.create({sectionName})
        // update course with section objectId
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                                            courseId,
                                                                            {
                                                                                $push:{
                                                                                    courseContent:newSection._id
                                                                                             }
                                                                            },{new:true})
                                                                            .populate(
                                                                                {
                                                                                    path:'courseContent',
                                                                                    populate:{
                                                                                        path:'subSection'
                                                                                    }
                                                                                }
                                                                            ).exec()
        // HW: use populate to replace sections/subsections both in the updated details
        // return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourse:updatedCourseDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again later",
            error:error.message
        })
    }
}


// update a section
exports.updateSection=async(req,res)=>{
    try {
        // data input
        const {sectionName,sectionId,courseId}=req.body;
        // data validation
        if(!sectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        // update data
        const updatedSection=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        const course=await Course.findById(courseId).populate(
            {
                path:'courseContent',
                populate:{
                    path:'subSection'
                }
            }
        ).exec()
             
        // return response
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            data:course
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again later",
            error:error.message
        })
    }
}


// Delete Scection
exports.deleteSection=async(req,res)=>{
    try {
        // get ID - assuming we are sending id in params
        // const {sectionId}=req.params
        const {courseId,sectionId}=req.body
        // use findByIdAndDelete
        const section=await Section.findById(sectionId)
        // delete subsection
        await SubSection.deleteMany({_id:{$in:section.subSection}})
        await Section.findByIdAndDelete(sectionId)
        // TODO[Testing]: do we need to delete the entry from course schema
        const updatedCourse=await Course.findByIdAndUpdate(courseId,{
            $pull:{courseContent:sectionId}
        }).populate(
            {
                path:'courseContent',
                populate:{
                    path:'subSection'
                }
            }
        ).exec()
        // return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
            data:updatedCourse
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, please try agein later",
            error:error.message
        })
    }
}