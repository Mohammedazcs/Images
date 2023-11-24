import React from 'react'
import FileUploadComponent from './FileUploadComponent'
import UploadForm from './CloudinaryUpload'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='max-w-[800px] mx-auto my-10'>
        <UploadForm/>
    </div>
  )
}

export default page