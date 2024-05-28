import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'

function RenderTotalAmount() {
    const {cart,total} =useSelector(state=>state.cart)
    const handleBuyCourse=()=>{
        const courses=cart.map((course)=>course._id)
        console.log("Bought these courses ",courses)
        // TODO: API integrate -> payment gateway
    }
  return (
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>

        <IconBtn
            text="Buy Now"
            onclick={handleBuyCourse}
            customeClasses={"w-full justify-center"}
        />
    </div>
  )
}

export default RenderTotalAmount