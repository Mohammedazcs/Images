'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { columns } from "./Cloumns"
import { DataTable } from "./DataTable"
import axios from 'axios'
import { useQuery } from 'react-query'
import { ImageT, Group } from '../types'

type Props = {}

const TableComponent = (props: Props) => {
    const {data: ImageData, error: ImageDatanError, isLoading: isImageDataLoading, refetch:refetchImageData} = useQuery<ImageT[]>({
        queryKey:'ImageData',
        queryFn: ()=> axios.get('/api/fileupload').then((res) => res.data),
        staleTime:60 * 1000,
        retry:3
     })

    console.log(ImageData)
  return (
    <div className='my-10'>
        {ImageData && (
        <DataTable columns={columns} data={ImageData} />
        )}
    </div>
  )
}

export default TableComponent