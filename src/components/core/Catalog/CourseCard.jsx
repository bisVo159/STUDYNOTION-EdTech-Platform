import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from "../../common/RatingStars"
import GetAvgRating from '../../../utils/avgRating'

export default function CourseCard({course,Height}) {
    const [avgReviewCount,setAvgReviewCount]=useState(0)
    useEffect(()=>{
        const count=GetAvgRating(course.ratingAndReviews)
        setAvgReviewCount(count)
    },[course])
  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div>
                <div>
                    <img
                    src={course?.thumbnail}
                    alt='thumbnail'
                    className={`${Height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div>
                    <p>{course?.courseName}</p>
                    <p>{course?.Instructor?.firstName} {course?.Instructor?.lastName}</p>
                    <div className='flex gap-x-3'>
                        <span>{avgReviewCount||0}</span>
                        <RatingStars Review_Count={avgReviewCount}/>
                        <span>{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p>{course?.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}
