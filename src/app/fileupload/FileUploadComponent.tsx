'use client'
import React, { useState } from 'react'
import { getSignedURL } from '../actions'
import axios from 'axios'
import { useQuery } from 'react-query'

type Props = {}
interface Group {
    id:number
    name: string
}

const FileUploadComponent = (props: Props) => {
    const [file, Setfile] = useState<File | undefined > (undefined)
    const [fileUrl, setFileUrl] = useState<string | undefined > (undefined)
    const [statusmessage, setStatusMessage] = useState<string | undefined> (undefined)
    const [loading, setLoading] = useState<boolean>()


    const computeSHA256 = async (file: File) => {
        const buffer = await file.arrayBuffer()
        const hashbuffer = await crypto.subtle.digest("SHA-256", buffer)
        const hashArray = Array.from(new Uint8Array(hashbuffer))
        const hashhex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
        return hashhex
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        Setfile(file)

        if(fileUrl){
            URL.revokeObjectURL(fileUrl)
        }

        if(file){
            const url = URL.createObjectURL(file)
            setFileUrl(url)
        }else{
            setFileUrl(undefined)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatusMessage('Creating')
        setLoading(true)
        try{
            if(file){
                setStatusMessage('Uploading file')
                const checksum = await computeSHA256(file)
                const signedUrlResult = await getSignedURL(file.type, file.size, checksum)
                if(signedUrlResult.failure !== undefined){
                    setStatusMessage("failed")
                    throw new Error(signedUrlResult.failure)
                }
                const url = signedUrlResult.success.url
                await fetch(url, {
                    method:'PUT',
                    body:file,
                    headers:{
                        "Content-Type":file?.type
                    }
                })
                console.log({file, url})
            }
        }catch(e){
            setStatusMessage('failed')
            console.error(e)
        }finally{
            setLoading(false)
        }
        setStatusMessage('Created')
        setLoading(false)
    }

    const {data: GroupData, error: GroupDatanError, isLoading: isGroupDataLoading, refetch:refetchGroupData} = useQuery<Group[]>({
        queryKey:'GroupData',
        queryFn: ()=> axios.get('/api/group').then((res) => res.data),
        staleTime:60 * 1000,
        retry:3
    })
  return (
    <div className='py-10 px-10 '>
        {statusmessage && (
            <div>{statusmessage}</div>
        )}
        <form onSubmit={handleSubmit}>
                <label htmlFor="media" className='block'>
                    Attach file
                    <input
                        type="file"
                        id="media" // Added an ID for proper association
                        className='bg-transparent flex-1 border-none outline-none hidden'
                        name='media'
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm"
                        onChange={handleChange}
                    />
                </label>
                {fileUrl && file && (
                    <div className='flex gap-6 items-center'>
                        {file.type.startsWith("image/") ? (
                            <div className='rounded-md overflow-hidden w-52  relative'>
                                <img
                                 src={fileUrl} 
                                 className='object-cover'
                                 alt={file.name} />
                            </div>
                        ):(
                            <div className='rounded-md overflow-hidden w-52 relative'>
                                <video className='object-cover' src={fileUrl} autoPlay loop muted></video>
                            </div>
                        )}
                        <button
                        type='button'
                        className='border rounded-mdf px-4 py-2'
                        onClick={()=> {setFileUrl(undefined); Setfile(undefined)}}
                        >
                            Remove
                        </button>
                    </div>
                )}
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default FileUploadComponent