import React from 'react'
import TableComponent from './TableComponent'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='max-w-[90%] mx-auto px-5'>
        <TableComponent/>
    </div>
  )
}

export default page