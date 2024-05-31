import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function RequirementField({name,label,register,errors,setValue,getValues}) {
    const[requirement,setRequirement]=useState("")
    const[requirementList,setRequiremenList]=useState([])
    const {course,editCourse}=useSelector(state=>state.course)

    useEffect(() => {
        if (editCourse) {
            setRequiremenList(course?.instructions)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
      }, [])

    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])

    const handleAddRequirement=()=>{
        if(requirement){
            setRequiremenList([...requirementList,requirement])
            setRequirement("")
        }
    }
    const handleRemoveRequirement=(index)=>{
        const updatedRequirementList=[...requirementList]
        updatedRequirementList.splice(index,1);
        setRequiremenList(updatedRequirementList)
    }
  return (
    <div className='flex flex-col space-y-2'>
        <div>
            <label htmlFor={name} className='lable-style'>{label}<sup className='text-pink-200'>*</sup></label>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e)=>setRequirement(e.target.value)}
                className='form-style w-full'
            />
            <button
            type='button'
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50'
            >
                Add
            </button>
        </div>

        {
            requirementList.length>0&&(
                <ul className='mt-2 list-inside list-disc'>
                    {
                        requirementList.map((requirement,index)=>(
                            <li key={index} className='flex items-center text-richblack-5 gap-2'>
                                <span>{requirement}</span>
                                <button
                                type='button'
                                onClick={()=>handleRemoveRequirement(index)}
                                className=' ml-2text-xs text-pure-greys-300'
                                >clear</button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default RequirementField