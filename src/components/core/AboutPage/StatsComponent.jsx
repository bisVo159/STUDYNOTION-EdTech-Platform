import React from 'react'

const states=[
    {id:1,count:"5K",label:"Active Students"},
    {id:2,count:"10+",label:"Mentors"},
    {id:3,count:"200+",label:"Courses"},
    {id:4,count:"50+",label:"Awards"},
]

function StatsComponent() {
  return (
    <div className='bg-richblack-700'>
        <div className='flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto '>
            <div className='grid grid-cols-2 md:grid-cols-4 text-center'>
                {
                    states.map((state)=>{
                        return (
                            <div className='flex flex-col py-10' key={state.id}>
                                <h1 className='text-[30px] font-bold text-richblack-5'>
                                    {state.count}</h1>
                                <h2 className='font-semibold text-[16px] text-richblack-500'>
                                    {state.label}</h2>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default StatsComponent