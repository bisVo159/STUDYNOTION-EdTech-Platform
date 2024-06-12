import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI' 
import VideoDetailsSlidber from '../components/core/ViewCourse/VideoDetailsSlidber'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import { setCourseSectionData,setEntireCourseData, setCompletedLectures,setTotalNoOfLectures} from '../slices/viewCourseSlice'

function ViewCourse() {
    const [reviewModal,setReviewModal]=useState(false)
    const {courseId}=useParams()
    const {token}=useSelector(state=>state.auth)
    const dispatch=useDispatch()

    useEffect(()=>{
        const setCourseSpecificDetails=async()=>{
            const courseData=await getFullDetailsOfCourse(courseId,token)
            dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent))
            dispatch(setEntireCourseData(courseData?.courseDetails))
            dispatch(setCompletedLectures(courseData?.completedVideos))
            let lectures=0;
            courseData?.courseDetails?.courseContent?.forEach((section)=>{
                lectures+=section.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        }
        setCourseSpecificDetails()
    },[])

  return (
    <>
        <div className='relative flex min-h-[calc(100vh-3.5rem)] text-white'>
            <VideoDetailsSlidber setReviewModal={setReviewModal}/>

            <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
                <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                    <Outlet/>
                </div>
            </div>

            {reviewModal&&<CourseReviewModal setReviewModal={setReviewModal}/>}
        </div>
    </>
  )
}

export default ViewCourse