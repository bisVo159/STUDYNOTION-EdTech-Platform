import React, { useEffect, useState } from 'react'

import { Swiper,SwiperSlide } from 'swiper/react'
import ReactStars from "react-rating-stars-component";
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

import { Autoplay, Pagination, FreeMode } from 'swiper/modules';
import { ratingsEndpoints } from '../../services/apis'
import { apiConnector } from '../../services/apiconnector'

function ReviewSlider() {
    const [reviews,setReviews]=useState([])
    const truncate=15

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
        <div className='h-[190px] max-w-maxContent'>
            <Swiper
            slidesPerView={4}
            spaceBetween={24}
            loop={true}
            freeMode={true}
            autoplay={{
                delay: 2500,
              }}
              modules={[Autoplay, Pagination, FreeMode]}
              className='w-full'
            >
                {
                    reviews.map((review)=>(
                        <SwiperSlide key={review._id}>
                            <img
                            src={review?.user?.image?review.user.image
                            :`https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName} ${review.user?.lastName}`}
                            alt='user'
                            className='w-9 h-9 rounded-full object-cover'
                            />
                            <p>{review.user?.firstName} {review.user?.lastName}</p>
                            <p className=' text-white'>{review?.course?.courseName}</p>
                            <p>{review.review.split(" ").splice(0,truncate).join(" ")}</p>
                            <p>{review?.rating.toFixed(1)}</p>
                            <ReactStars
                            count={5}
                            edit={false}
                            value={review?.rating}
                            size={20}
                            color2='#ffd700'
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider