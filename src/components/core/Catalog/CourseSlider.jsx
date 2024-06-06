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
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
                breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
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
            ( <p>No Courses Found</p> )
        }
    </>
  )
}
