import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'
import { IoChevronBackSharp } from "react-icons/io5";
import { FaAngleUp,FaAngleDown } from "react-icons/fa6";

function VideoDetailsSlidber({setReviewModal}) {
  const {sectionId,subSectionId}=useParams()
  const [activeStatus,setActiveStatus]=useState(sectionId)
  const [videobarActive,setVideobarActive]=useState(subSectionId)
  const navigate=useNavigate()
  const location=useLocation()
  const{
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures
  }=useSelector(state=>state.viewCourse)

  useEffect(()=>{
    const viseoSlidbarDetails=()=>{
      if(!courseSectionData.length) return;

      const currentSectionIndex=courseSectionData.findIndex(
        (data)=>data._id===sectionId)

      const currentSubSectionIndex=courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
        (data)=>data._id===subSectionId)


        const activeSubSectionId=courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
        // set current section here
        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
        // set current sub-section here
        setVideobarActive(activeSubSectionId);
    }
    viseoSlidbarDetails()
  },[courseSectionData,courseEntireData,location.pathname])
  return (
    <>
      <div>
        {/* for button and heading */}
        <div>
          {/* for button */}
          <div>
            <div 
            onClick={()=>navigate("/dashboard/enrolled-courses")}>
              <IoChevronBackSharp/>
            </div>
            <div>
              <IconBtn
              text="Add Review"
              onclick={()=>setReviewModal(true)}
              />
            </div>
          </div>
          {/* for heading */}
          <div>
            <p>{courseEntireData?.courseName}</p>
            <p>{completedLectures.length}/{totalNoOfLectures}</p>
          </div>
        </div>

        {/* for sections and subsections */}
        <div>
          {
            courseSectionData.map((section)=>(
              <div
              onClick={()=>setActiveStatus(section?._id)}
              key={section?._id}
              >
                {/* section */}
                <div>
                  <div>
                    {section?.sectionName}
                  </div>
                  {activeStatus===section?._id?<FaAngleUp/>:<FaAngleDown/>}
                </div>

                {/* subsections */}
                <div>
                    {
                      activeStatus===section?._id&&(
                        <div>
                          {
                            section?.subSection?.map((topic)=>(
                              <div
                              className={`flex gap-5 p-5 ${
                                videobarActive===topic._id
                                ?"bg-yellow-200 text-richblack-900"
                                :"bg-richblack-900 text-white"
                              }`}
                              key={topic._id}
                              onClick={()=>{
                                navigate(`view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic._id}`)
                                setVideobarActive(topic?._id)
                              }}
                              >
                                <input
                                type='checkbox'
                                checked={completedLectures?.includes(topic?._id)}
                                onChange={()=>{}}
                                />
                                <span>{topic.title}</span>
                              </div>
                            ))
                          }
                        </div>
                      )
                    }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default VideoDetailsSlidber