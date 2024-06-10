import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buyCourse } from '../services/operations/studentFeaturesApi'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI'
import GetAvgRating from '../utils/avgRating'
import ConfirmationModal from '../components/common/ConfirmationModal'
import RatingStars from "../components/common/RatingStars"
import { formatDate } from '../services/formatDate'
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'

export default function CourseDetails() {
  const {token}=useSelector(state=>state.auth)
  const {user}=useSelector(state=>state.profile)
  const {loading}=useSelector(state=>state.profile)
  const {paymentLoading}=useSelector(state=>state.course)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {courseId}=useParams()

  const[courseData,setCourseData]=useState(null)
  const [avgReviewCount,setAvgReviewCount]=useState(0)
  const [totalNoOfLectures,setTotalNoOfLectures]=useState(0)
  const [confirmationModal,setConfirmationModal]=useState(null)
  const [isActive,setIsActive]=useState(Array(0))

  const handleActive=(id)=>{
    setIsActive(
      !isActive.includes(id)?isActive.concat(id)
      :isActive.filter((e)=>e!==id)
    )
  }

  useEffect(()=>{
    const getCourseFullDetails=async()=>{
      try {
        const result=await fetchCourseDetails(courseId)
        setCourseData(result)
      } catch (error) {
        console.log("Coult not fetch course details")
      }
    }
    getCourseFullDetails()
  },[courseId])

  useEffect(()=>{
    const count=GetAvgRating(courseData?.courseDetails?.ratingAndReviews)
    setAvgReviewCount(count)
  },[courseData])

  useEffect(()=>{
    let lectures=0;
    courseData?.courseDetails?.courseContent.forEach((sec)=>
      lectures+=sec.subSection.length||0)

    setTotalNoOfLectures(lectures)
  },[courseData])

  const handleBuyCourse=()=>{
      if(token){
        buyCourse([courseId],token,user,navigate,dispatch)
        return
      }

      setConfirmationModal({
        text1:"You are not logged in",
        text2:"Please login to purchase the course",
        btn1Text:"Login",
        btn2Text:"Cancel",
        btn1Handler:()=>navigate("/login"),
        btn2Handler:()=>setConfirmationModal(null)
      })
    }

    if(loading||!courseData){
      return <div className='grid place-items-center h-screen'>
        <div className='spinner'></div>
      </div>
    }
    const{
      _id:course_Id,
      courseName,
      courseDescription,
      Instructor,
      whatWillYouLearn,
      courseContent,
      ratingAndReviews,
      price,
      thumbnail,
      studentsEnrolled,
      createdAt
    }=courseData?.courseDetails
  return (
    <div className='flex flex-col text-white'>
      <div className='relative flex flex-col justify-start p-8'>
        <p>{courseName}</p>
        <p>{courseDescription}</p>
        <div className='flex gap-x-2'>
          <span>{avgReviewCount}</span>
          <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
          <span>{`(${ratingAndReviews.length} reviews)`}</span>
          <span>{`(${studentsEnrolled.length}  students enrolled)`}</span>
        </div>

        <div>
          <p>Created By {Instructor.firstName}</p>
        </div>
        <div className='flex gap-x-3'>
          <p>Created At {formatDate(createdAt)}</p>
          <p>English</p>
        </div>

        <div>
          <CourseDetailsCard
          course={courseData?.courseDetails}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
          />
        </div>
      </div>

      <div>
        <p>What you'll learn</p>
        <div>{whatWillYouLearn}</div>
      </div>

      <div>
        <div>
          <p>Course Content</p>
        </div>

        <div className='flex gap-x-3 justify-between'>
            <div className='flex gap-x-3'>
              <span>{courseContent.length} section(s)</span>
              <span>{totalNoOfLectures} lectures</span>
              <span>{courseData?.totalDuration} total length</span>
            </div>

            <div>
              <button
              onClick={()=>setIsActive([])}
              >Collapse all Sections</button>
            </div>
        </div>
      </div>

      {confirmationModal&&<ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}
