import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../services/apiconnector'
import {contactusEndpoint} from"../../services/apis"
import CountryCode from "../../data/countrycode.json"

function ContactUsForm() {
  const[loading,setLoading]=useState(false)
  const {
      register,
      handleSubmit,
      reset,
      formState: { errors ,isSubmitSuccessful},
  }=useForm()

  const submitContactForm=async(data)=>{
    console.log("Logging Data ",data)
    setLoading(true)
    try {
      // const response=await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data)
      const response={status:"OK"}
      console.log("Logging response ",response)
    } catch (error) {
      console.log(error.message)
    }
    setLoading(false)
  }
  useEffect(()=>{
    if(isSubmitSuccessful){
      reset({
        email:"",
        firstName:"",
        lastName:"",
        message:"",
        phoneNo:""
      })
    }
  },[isSubmitSuccessful,reset])
  return (
    <form onSubmit={handleSubmit(submitContactForm)}
    className='space-y-6'
    >
      <div className='flex flex-col gap-3'>
        {/* Name */}
        <div className='flex gap-3'>
          {/* firstName */}
          <div className='flex flex-col'>
            <label htmlFor="firstName">First Name</label>
            <input
            type='text'
            name='firstName'
            id='firstName'
            placeholder='Enter First Name'
            className='bg-richblack-600 p-2 rounded-md'
            {...register('firstName',{required:true})}
            />
            {
              errors.firstName&&<span>Please Enter your First Name</span>
            }
          </div>

          {/* lastName */}
          <div className='flex flex-col'>
            <label htmlFor="lastName">Last Name</label>
            <input
            type='text'
            name='lastName'
            id='lastName'
            placeholder='Enter Last Name'
            className='bg-richblack-600 p-2 rounded-md'
            {...register('lastName')}
            />
          </div>
        </div>

        {/* email */}
        <div className='flex flex-col'>
            <label htmlFor="email">Email Address</label>
            <input
            type='email'
            name='email'
            id='email'
            placeholder='Enter Email Address'
            className='bg-richblack-600 p-2 rounded-md'
            {...register('email',{required:true})}
            />
            {
              errors.email&&<span>Please Enter your Email Address</span>
            }
        </div>

        {/* phone No */}
        <div className='flex flex-col'>
            <label htmlFor="phonenumber">Phone Number</label>
            <div className='flex gap-5'>
            {/* dropdown */}
              <div className='max-w-sm'>
                  <select
                  name='dropdown'
                  id='dropdown'
                  className='   bg-richblack-600 rounded-md focus:ring-blue-500
                   focus:border-blue-500  w-12 appearance-none block
                  p-2'
                  {...register('countrycode',{required:true})}
                  >
                    {
                      CountryCode.map((country,index)=>(
                        <option key={index} value={country.code}
                        >
                          {country.code}  - {country.country}</option>
                      ))
                    }
                  </select>
              </div>

              <div className='grow'>
                <input
                type='tel'
                name='phonenumber'
                id='phonenumber'
                placeholder='0123456789'
                className='bg-richblack-600 p-2 rounded-md w-full'
                {...register('phoneNo',{
                  required:{value:true,message:"Please enter Phone Number"},
                  maxLength:{value:10,message:"Invalid phone number"},
                  minLength:{value:8,message:"Invalid phone number"},
                })}
                />
                {
                  errors.phoneNo&&<span>{errors.phoneNo.message}</span>
                }
              </div>
            </div>
        </div>

        {/* message */}
        <div className='flex flex-col'>
            <label htmlFor="message">Message</label>
            <textarea
            name='message'
            id='message'
            cols="30"
            rows="7"
            placeholder='Enter your message here'
            className='bg-richblack-600 p-2 rounded-md'
            {...register('message',{required:true})}
            />
            {
              errors.message&&<span>Please Enter message</span>
            }
        </div>
      </div>

      <button type='submit'
      className='border border-richblack-700 w-full
       rounded-md bg-yellow-50 p-2 text-[15px]  font-bold text-black'
      >
            Send Message
      </button>
    </form>
  )
}

export default ContactUsForm