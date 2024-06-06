import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'
import { VscAdd } from "react-icons/vsc";
import CoursesTable from './InstructorCourses/CoursesTable'

function MyCourses() {
    const {token}=useSelector(state=>state.auth)
    const navigate=useNavigate()
    const [courses,setCourses]=React.useState([])
    useEffect(()=>{
        const fetchCourses=async()=>{
            const result=await fetchInstructorCourses(token);

            if(result){
                setCourses(result)
            }
        }
        fetchCourses()
    },[])
  return (
    <div>
        <div className='mb-14 flex items-center justify-between'>
            <h1 className='text-3xl font-medium text-richblack-5'>My Courses</h1>
            <IconBtn
            text="Add Course"
            onclick={()=>navigate("/dashboard/add-course")}
            children={<VscAdd/>}
            />
        </div>

        {courses.length>0&&<CoursesTable courses={courses} setCourses={setCourses}/>}
    </div>
  )
}

export default MyCourses