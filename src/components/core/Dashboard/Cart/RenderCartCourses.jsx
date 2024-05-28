import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactStars from "react-rating-stars-component";

function RenderCartCourses() {
    const {cart,removeFromCart}=useSelector(state=>state.cart)
    const dispatch=useDispatch()

  return (
    <div>
        {
            cart.map((course)=>{
                return <div>
                    <div>
                        <img
                        src={course?.thumbnail} alt=''
                        />

                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                {/* write logic */}
                                <span>4.8</span>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    isHalf={true}
                                    emptyIcon={<i className="far fa-star"></i>}
                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                    fullIcon={<i className="fa fa-star"></i>}
                                    activeColor="#ffd700"
                                />

                                <span>{course?.ratingAndReviews?.length}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                        onClick={()=>dispatch(removeFromCart(course._id))}
                        >
                        <RiDeleteBin6Line />
                        <span>Remove</span>
                        </button>

                        <p>Rs {course?.price}</p>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default RenderCartCourses