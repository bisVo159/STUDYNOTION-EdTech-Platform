import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

function Dashboard() {
    const {loading:authLoading}=useSelector(state=>state.auth)
    const {loading:profileLoading}=useSelector(state=>state.profile)

    if(authLoading||profileLoading){
        return <div className='spinner w-full flex items-center justify-center'></div>
    }
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
        <Sidebar/>

        <div className='h-[calc(100vh-3.5rem)] overflow-auto'>
                <div className='mx-auto w-11/12 max-w-maxContent '>
                    <Outlet/>
                </div>
        </div>
    </div>
  )
}

export default Dashboard