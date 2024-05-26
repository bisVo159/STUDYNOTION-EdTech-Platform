import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn'
import { useNavigate } from 'react-router-dom'
import { LiaEditSolid } from "react-icons/lia";

function MyProfile() {
    const {user}=useSelector(state=>state.profile)
    const navigate=useNavigate()
  return (
    <div className='text-brown-5'>
        <h1>My Profile</h1>

        {/* section 1 */}
        <div>
            <div>
                <img src={user?.image}
                    alt={`profile-${user.firstName}`}  
                    className='aspect-square w-[78px] rounded-full object-cover'
                />
                <div>
                    <p>{user?.firstName+" "+user?.lastName}</p>
                    <p>{user?.email}</p>
                </div>
            </div>

            <IconBtn
            text={"Edit"}
            onclick={()=>navigate("dashboard/settings")}
            children={<LiaEditSolid />}
            />
        </div>

        {/* section 2 */}
        <div>
            <div>
                <p>About</p>
                <IconBtn
                text={"Edit"}
                onclick={()=>navigate("dashboard/settings")}
                children={<LiaEditSolid />}
             />
            </div>
            <p>{user?.additionalDetails?.about?user?.additionalDetails?.about:"Write Something about yourself"}</p>
    
        </div>

        {/* section 3 */}
        <div>
            <div>
                <p>Personal Details</p>
                <IconBtn
                    text={"Edit"}
                    onclick={()=>navigate("dashboard/settings")}
                    children={<LiaEditSolid />}
                />
            </div>

            <div>
                <div>
                    <p>First Name</p>
                    <p>{user?.firstName}</p>
                </div>
                <div>
                    <p>Email</p>
                    <p>{user?.email}</p>
                </div>
                <div>
                    <p>Gender</p>
                    <p>{user?.additionalDetails?.gender?user?.additionalDetails?.gender:"Add Gender"}</p>

                </div>
                <div>
                    <p>Last Name</p>
                    <p>{user?.lastName}</p>
                </div>
                <div>
                    <p>Phone Number</p>
                    <p>{user?.additionalDetails?.contactNumber?user?.additionalDetails?.contactNumber:"Add Contact Number"}</p>

                </div>
                <div>
                    <p>Date Of Birth</p>
                    <p>{user?.additionalDetails?.dateOfBirth?user?.additionalDetails?.dateOfBirth:"Add Date Of Birth"}</p>

                </div>

            </div>
        </div>
    </div>
  )
}

export default MyProfile