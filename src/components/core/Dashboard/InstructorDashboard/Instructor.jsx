import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { getInstructorData } from '../../../../services/operations/profileAPI'
import { Link } from 'react-router-dom'
import InstructorChart from './InstructorChart'

function Instructor() {
    const  {token}=useSelector(state=>state.auth)
    const  {user}=useSelector(state=>state.profile)
    const [loading,setLoading]=useState(false)
    const [instructorData,setInstructorData]=useState([])
    const [courses,setCourses]=useState([])
    useEffect(()=>{
        const courseDataWithStats=async()=>{
            const instructorApiData=await getInstructorData(token)
            const result=await fetchInstructorCourses(token)
            console.log("instructorApiData ",instructorApiData)

            if(instructorApiData.length){
                setInstructorData(instructorApiData)
            }
            if(result) setCourses(result)
        }
        courseDataWithStats()
    },[])

    const totalAmout=instructorData.reduce((acc,data)=> acc+data.totalAmountGenerated,0)
    const totalStudents=instructorData.reduce((acc,data)=>acc+data.totalStudentsEnrolled,0)
  return (
    <div className='text-white'>
        <div>
            <h1>Hi {user.firstName}</h1>
            <p>Let's start something new</p>
        </div>
        {
            loading?<div className='spinner'></div>
            :courses.length?(
                <div>
                    <div>
                        <InstructorChart courses={instructorData}/>

                        <div>
                            <p>Statistics</p>
                            <div>
                                <p>Top Courses</p>
                                <p>{courses.length}</p>
                            </div>
                            <div>
                                <p>Total Students</p>
                                <p>{totalStudents}</p>
                            </div>
                            <div>
                                <p>Total Income</p>
                                <p>{totalAmout}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Render 3 courses */}
                        <p>Your Courses</p>
                        <Link to="/dashboard/my-courses">View All</Link>
                        {
                            courses.slice(0,3).map((course)=>(
                                <div>
                                    <img 
                                    src={course.thumbnail}
                                    alt='course'
                                    />

                                    <div>
                                        <p>{course.courseName}</p>
                                        <div className='flex items-center gap-x-2'>
                                            <p>{course.studentsEnrolled.length} students</p>
                                            <p>|</p>
                                            <p>Rs. {course.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
            :(<div>
                <p>You have not created any courses yet</p>
                <Link to="/dashboard/add-course">create a COurse</Link>
            </div>)
        }
    </div>
  )
}

export default Instructor