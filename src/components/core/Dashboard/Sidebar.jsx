import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'

function Sidebar() {
    const {user,loading:profileLoading}=useSelector(state=>state.profile)
    const {loading:authLoading}=useSelector(state=>state.auth)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const[confirmationModal,setConfirmationModal]=useState(null)

    if(authLoading||profileLoading){
        return <div className='spinner w-full flex items-center justify-center'></div>
    }
  return (
    <div>
        <div className='flex min-w-[222px] flex-col border-r-[1px]
          border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>
            <div className='flex flex-col'>
                {
                    sidebarLinks.map((link)=>{
                        if(link.type&&link.type!==user?.accountType) return;
                        return <SidebarLink key={link.id} link={link}/>
                    })
                }
            </div>

            <div className='mx-auto my-6 h-[1px] w-11/12 backdrop-opacity-600'></div>
            <div className='flex flex-col'>
                <SidebarLink
                  link={{name:"settings",path:"dashboard/settings",icon:"VscSettingsGear"}}
                />

                <button
                      onClick={()=>setConfirmationModal({
                        text1:"Are you sure?",
                        text2:"You will be logged out of your account",
                        btn1Text:"Logout",
                        btn2Text:"Cancel",
                        btn1Handler:()=>dispatch(logout(navigate)),
                        btn2Handler:()=>setConfirmationModal(null)
                      })}
                      className='text-sm font-medium text-richblack-300 px-8 py-2'
                      >
                        <div className='flex items-center gap-x-2'>
                          <VscSignOut/>
                          <span>Logout</span>
                        </div>
                </button>
          </div>
        </div>

        {confirmationModal&&<ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default Sidebar