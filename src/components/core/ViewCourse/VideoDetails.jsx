import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI'
import { updateCompletedLectures } from '../../../slices/viewCourseSlice'
import {BigPlayButton, Player } from 'video-react'
// import '~video-react/dist/video-react.css';
import IconBtn from '../../common/IconBtn'

function VideoDetails() {
  const {courseId,sectionId,subSectionId}=useParams()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const playerRef=useRef()
  const location=useLocation()
  const {token}=useSelector(state=>state.auth)
  const{
    courseSectionData,
    courseEntireData,
    completedLectures
    }=useSelector(state=>state.viewCourse)

  const [videoData,setVideoData]=useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded,setVideoEnded]=useState(false)
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const setVideoSpecificData=async()=>{
      if(!courseSectionData?.length) return

      if(!courseId||!sectionId||!subSectionId) navigate("/dashboard/enrolled-courses")

      else{
        const filteredData=courseSectionData.filter(section=>section._id===sectionId)
        const filteredVideoData=filteredData?.[0].subSection?.filter((data)=>data._id===subSectionId)
        setVideoData(filteredVideoData?.[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    }
    setVideoSpecificData()
  },[courseSectionData,courseEntireData,location.pathname])

  const isFirstVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(data=>data._id===subSectionId)

    return (currentSectionIndex===0)&&(currentSubSectionIndex===0)
  }
  const isLastVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
    const noOfSubSections=courseSectionData[currentSectionIndex].subSection.length
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(data=>data._id===subSectionId)

    return (currentSectionIndex===courseSectionData.length-1)&&(currentSubSectionIndex===noOfSubSections-1)
  }

  const goToNextVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
    const noOfSubSections=courseSectionData[currentSectionIndex].subSection.length
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(data=>data._id===subSectionId)

    let nextSectionId,nextSubSectionId;
    if(currentSubSectionIndex<noOfSubSections-1){
      nextSectionId=sectionId
      nextSubSectionId=courseSectionData[currentSectionIndex].subSection?.[currentSubSectionIndex+1]._id
    }else{
      nextSectionId=courseSectionData[currentSectionIndex+1]._id
      nextSubSectionId=courseSectionData[currentSectionIndex+1].subSection?.[0]._id
    }

    navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
  }
  const goToPrevVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
    const prevSectionLength=currentSectionIndex>0&&courseSectionData[currentSectionIndex-1].subSection.length
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(data=>data._id===subSectionId)

    let prevSectionId,prevSubSectionId;
    if(currentSubSectionIndex>0){
      prevSectionId=sectionId
      prevSubSectionId=courseSectionData[currentSectionIndex].subSection?.[currentSubSectionIndex-1]._id
    }else{
      prevSectionId=courseSectionData[currentSectionIndex-1]._id
      prevSubSectionId=courseSectionData[currentSectionIndex-1].subSection?.[prevSectionLength-1]._id
    }

    navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
  }

  const handleLectureCompletion=async()=>{
    setLoading(true)

    const res=await markLectureAsComplete({courseId,subSectionId},token)
    if(res) dispatch(updateCompletedLectures(subSectionId))
    
    setLoading(false)
  }
  return (
    <div className='flex flex-col gap-5 text-white'>
      {
        !videoData?(
          <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
        )
        :(
            <Player
            aspectRatio='16:9'
            ref={playerRef}
            playsInline
            autoPlay={true}
            onEnded={()=>setVideoEnded(true)}
            src={videoData.videoUrl}
            >
              <BigPlayButton position="center" />

              {
                videoEnded&&(
                <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                }}
                className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                >
                  {
                    !completedLectures.includes(subSectionId)&&(
                      <IconBtn
                      disabled={loading}
                      onclick={handleLectureCompletion}
                      text={!loading?"Mark As Completed":"Loading..."}
                      customeClasses="text-xl max-w-max px-4 mx-auto"
                      />
                    )
                  }

                  <IconBtn
                    disabled={loading}
                    onclick={()=>{
                      if(playerRef?.current){
                        playerRef.current.seek(0)
                        playerRef.current.play()
                      }
                      setVideoEnded(false)
                    }}
                    text="Rewatch"
                    customeClasses="text-xl max-w-max px-4 mx-auto text-center"
                  />

                  <div className='mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl'> 
                    {!isFirstVideo()&&(
                      <button 
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className='blackButton'
                      >Prev</button>
                    )}
                    {!isLastVideo()&&(
                      <button 
                      disabled={loading}
                      onClick={goToNextVideo}
                      className='blackButton'
                      >Next</button>
                    )}
                  </div>
                </div>)
              }
            </Player>
        )
      }
      <h1 className='mt-4 text-3xl font-semibold'>{videoData?.title}</h1>
      <p className='pt-2 pb-6'>{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails