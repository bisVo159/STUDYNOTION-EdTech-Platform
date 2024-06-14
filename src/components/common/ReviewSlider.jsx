import React, { useEffect, useState } from 'react'

import { Swiper,SwiperSlide } from 'swiper/react'
import ReactStars from "react-rating-stars-component";
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FaStar } from "react-icons/fa"
import { Autoplay, Pagination, FreeMode } from 'swiper/modules';
import { ratingsEndpoints } from '../../services/apis'
import { apiConnector } from '../../services/apiconnector'

function ReviewSlider() {
    const [reviews,setReviews]=useState([])
    const truncateWords=15

    useEffect(()=>{
        const fetchAllReviews=async()=>{
            const response=await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API)
            console.log("REVIEWS_DETAILS_API",response)
            if(response?.data?.success){
                setReviews(response.data.data)
            }
        }
        fetchAllReviews()
    },[])
  return (
    <div className='w-full'>
        <div className='my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent'>
            <Swiper
            slidesPerView={1}
            spaceBetween={24}
            loop={true}
            freeMode={true}
            autoplay={{
                delay: 2500,
              }}
              modules={[Autoplay, Pagination, FreeMode]}
              breakpoints={{
                1024: {
                  slidesPerView: 4,
                },
              }}
              className='w-full'
            >
                {
                    reviews.map((review)=>(
                        <SwiperSlide key={review._id}>
                            <div className='flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25'>
                                <div className='flex items-center gap-4'>
                                    <img
                                    src={review?.user?.image?review.user.image
                                    :`https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName} ${review.user?.lastName}`}
                                    alt='user'
                                    className='h-9 w-9 rounded-full object-cover'
                                    />
                                    <div className='flex flex-col'>
                                        <h1 className='font-semibold text-richblack-5'>{review.user?.firstName} {review.user?.lastName}</h1>
                                        <h2 className=' text-[12px] font-medium text-richblack-500'>{review?.course?.courseName}</h2>
                                    </div>
                                </div>
                                <p className="font-medium text-richblack-25">
                                    {review?.review.split(" ").length > truncateWords
                                    ? `${review?.review
                                        .split(" ")
                                        .slice(0, truncateWords)
                                        .join(" ")} ...`
                                    : `${review?.review}`}
                                </p>
                                <div className='flex items-center gap-2'>
                                    <p className='font-semibold text-yellow-100'>{review?.rating.toFixed(1)}</p>
                                    <ReactStars
                                    count={5}
                                    edit={false}
                                    value={review?.rating}
                                    size={20}
                                    activeColor='#ffd700'
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider