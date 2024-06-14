import React from 'react'
import { Swiper,SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import CourseCard from './CourseCard'

export default function CourseSlider({courses}) {
  return (
    <>
        {
            courses?.length?(
                <Swiper
                slidesPerView={1}
                spaceBetween={25}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay,Navigation, Pagination]}
                breakpoints={{
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="max-h-[30rem] mySwiper"
                >
                    {
                        courses.map((course)=>(
                            <SwiperSlide key={course._id}>
                                <CourseCard  course={course} Height={"h-[250px]"}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ):
            ( <p className='text-xl text-richblack-5'>No Courses Found</p> )
        }
    </>
  )
}
