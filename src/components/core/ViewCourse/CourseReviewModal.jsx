import React, { useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import {createRating} from "../../../services/operations/courseDetailsAPI"

function CourseReviewModal({setReviewModal}) {
    const {user}=useSelector(state=>state.profile)
    const {token}=useSelector(state=>state.auth)
    const{courseEntireData }=useSelector(state=>state.viewCourse)
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    }=useForm()

    useEffect(()=>{
        setValue("courseExperience","")
        setValue("courseRating",0)
    },[])

    const ratingChanged = (newRating) => {
        setValue("courseRating",newRating)
      };

    const onSubmit=async(data)=>{
        await createRating({
            courseId:courseEntireData._id,
            rating:data.courseRating,
            review:data.courseExperience
        })

        setReviewModal(false)
    }
  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
        <div className='w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6'>
            {/* Modal Header */}
            <div className='flex w-full justify-between items-center'>
                <p>Add Review</p>
                <button
                onClick={()=>setReviewModal(false)}
                >
                    <RxCross2/>
                </button>
            </div>

            {/* Modal Body */}
            <div>
                <div>
                    <img
                    src={user?.image}
                    alt='user image'
                    className='aspect-square w-[50px] rounded-full object-cover'
                    />

                    <div>
                        <p>{user?.firstName} {user?.lastName}</p>
                        <p>Posting Publicly</p>
                    </div>
                </div>

                <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-6 flex flex-col items-center'
                >
                      <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            activeColor="#ffd700"
                        />

                        <div>
                            <label htmlFor='courseExperience'>Add Your  Experience</label>
                            <textarea
                            id='courseExperience'
                            placeholder='Add Your  Experience'
                            {...register("courseExperience",{required:true})}
                            className='form-style w-full min-h-[130px]'
                            />
                            {errors.courseExperience&&<span>Please add your experience</span>}
                        </div>

                        {/* cancel and save button */}
                        <div className='flex items-center justify-end gap-x-3 w-full'>
                            <button onClick={()=>setReviewModal(false)}>
                                Cancel
                            </button>

                            <IconBtn text="Save"/>
                        </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal