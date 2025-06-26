import React from 'react'

const ResumeUploader = () => {
  return (
    <>
        <section>
            <h2>Apply for a Job?</h2>
            <p>Uploading your CV here will automatically fill up the form for you!</p>
        </section>
        <section>
            <h3>Upload Your Resume</h3>
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-700
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-600 file:text-white
                        hover:file:bg-blue-700"
            />
        </section>
    </>
  )
}

export default ResumeUploader
