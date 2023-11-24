import { Flex } from '@radix-ui/themes'
import React from 'react'
import Link from 'next/link'

type Props = {}

const Navbar = (props: Props) => {
  return ( 
    <div className='py-3 px-3 text-xl font-medium mb-8'>
        <Flex align='center' justify='center' gap='6'>
            <Link href='/' className='hover:bg-blue-100 px-2 rounded-md'>Home</Link>
            <Link href='/fileupload' className='hover:bg-blue-100 px-2 rounded-md'>File Upload</Link>
            <Link href='/imagetable' className='hover:bg-blue-100 px-2 rounded-md'>Image Table</Link>
        </Flex>
    </div>
  )
}

export default Navbar