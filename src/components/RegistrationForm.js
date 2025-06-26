import React from 'react'

const RegistrationForm = () => {
  return (
    <section>
        <h2 className='text'>Registration Form</h2>
        <form className='grid grid-cols-1 gap-4'>

          <label for="firstName">First Name</label>
          <input
            type='text'
            name='firstName'
            className='p-2 border rounded-sm'
            placeholder='Your first name e.g Juan'
          />

          <label for="lastName">Last Name</label>
          <input
            type='text'
            name='lastName'
            className='p-2 border rounded-sm'
            placeholder='Your first name e.g Dela Cruz'
          />

          <label for="emailAddress">Email</label>
          <input
            type='email'
            name='emailAddress'
            className='p-2 border rounded-sm'
            placeholder='Your email address e.g name@example.com'
          />

          <label for="tel">Contact Number</label>
          <input
            type='tel'
            name='tel'
            className='p-2 border rounded-sm'
            placeholder='Contact Number'
          />

          <label for="workExperience">Work Experience</label>
          <textarea
            name="workExperience"
            placeholder="Work Experience"
            className="p-2 border rounded"
          ></textarea>

          <label for="education">Education</label>
          <textarea
            name="education"
            placeholder="Education"
            className="p-2 border rounded"
          ></textarea>

          <button 
            type='submit'
            className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
          >
            Submit Form
          </button>
        </form>
    </section>
  )
}

export default RegistrationForm
