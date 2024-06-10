import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../../slices/cartSlice'
import toast from 'react-hot-toast'
import { ACCOUNT_TYPE } from '../../../utils/constants'

function CourseDetailsCard({course,setConfirmationModal,handleBuyCourse}) {
    const {user}=useSelector(state=>state.profile)
    const {token}=useSelector(state=>state.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {
        thumbnail:ThumbnailImage,
        price:currentPrice,
        }=course

    const handleAddToCart=()=>{
        if((user?.accountType===ACCOUNT_TYPE.INSTRUCTOR)||!token){
            toast.error("You are an Instructor, You cant buy a course")
            return
        }
        if(token){
            dispatch(addToCart(course))
            return
        }

        setConfirmationModal({
            text1:"You are not logged in",
            text2:"Please login to add the Cart",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null)
          })
    }

    const handleShare=async()=>{
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied to Clipboard")
    }
  return (
    <div>
        <img
        src={ThumbnailImage}
        alt='Thumbnail Image'
        className='max-h-[300px] min-h-[180px] w-[400px] rounded-xl'
        />
        <div>Rs. {currentPrice}</div>
        <div className='flex flex-col items-start gap-y-6'>
            <button
            className='bg-yellow-50 text-richblack-900'
            onClick={
                user&&course?.studentsEnrolled?.includes(user?._id)?
                ()=>navigate("/dashboard/enrolled-courses")
                :handleBuyCourse
            }
            >
                {
                    user&&course?.studentsEnrolled?.includes(user?._id)?"Go to Course":"Buy Now"
                }
            </button>
            {
                (!course?.studentsEnrolled?.includes(user?._id))&&(
                    <button
                    className='bg-yellow-50 text-richblack-900'
                    onClick={handleAddToCart}
                    >Add to Cart</button>
                )
            }
        </div>

        <div>
            <p>30-Days Money-Back Gurantee</p>
            <p>This Course Includes:</p>
            <div className='flex flex-col gap-y-3'>
                 {
                    course?.instructions?.map((item,index)=>(
                        <p key={index} className='flex gap-2'>
                            <spam>{item}</spam>
                        </p>
                    ))
                 }
            </div>
        </div>

        <div>
            <button
            className='mx-auto flex items-center gap-2 p-6  text-yellow-50'
            onClick={handleShare}
            >
                Share
            </button>
        </div>
    </div>
  )
}

export default CourseDetailsCard