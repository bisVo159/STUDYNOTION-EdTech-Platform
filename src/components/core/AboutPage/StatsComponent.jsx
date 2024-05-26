import React from 'react'

const states=[
    {id:1,count:"5K",label:"Active Students"},
    {id:2,count:"10+",label:"Mentors"},
    {id:3,count:"200+",label:"Courses"},
    {id:4,count:"50+",label:"Awards"},
]

function StatsComponent() {
  return (
    <div>
        <div className='flex gap-5 justify-center'>
            {
                states.map((state)=>{
                    return (
                        <div key={state.id}>
                            <h1>{state.count}</h1>
                            <h2>{state.label}</h2>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default StatsComponent