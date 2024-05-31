import React from 'react'
import { useForm } from 'react-hook-form'

function CourseBuilderForm() {
  const {register,handleSubmit,setValue,formState:{errors}}=useForm()

  return (
    <div>
      <p>Course Builder</p>
      <form>
        <label>Section Name<sup>*</sup></label>
        <input
        id='sectionName'
        placeholder='Add Section Name'
        {...register('sectionName',{required:true})}
        className='form-style'
        />
        {errors.sectionName&&<span>Section Name is required</span>}
      </form>
    </div>
  )
}

export default CourseBuilderForm