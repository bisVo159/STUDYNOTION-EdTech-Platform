import React from 'react'
import ContactUsForm from '../../ContactPage/ContactUsForm'

function ContactFormSection() {

  return (
    <div className='mx-auto my-10 flex flex-col items-center'>
        <div className='flex flex-col items-center'>
            <h1 className='text-4xl font-semibold'>Get  in Touch</h1>
            <p>We'd love to here for you, Please fill out this form</p>
        </div>

        <ContactUsForm/>
    </div>
  )
}

export default ContactFormSection