'use client'
import { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud } from "react-icons/fi";
import { useQuery } from 'react-query';
import Select from 'react-select';

interface Group {
    id:number
    name: string
}

interface GroupOption {
    value:string
    label: string
}

const UploadForm = () => {
  const [file, SetFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined > (undefined)
  const [statusmessage, setStatusMessage] = useState<string | undefined> (undefined)
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<GroupOption | null>(null);

  console.log(selectedOption)


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    SetFile(file);
    if(fileUrl){
        URL.revokeObjectURL(fileUrl)
    }

    if(file){
        const url = URL.createObjectURL(file)
        setFileUrl(url)
    }else{
        setFileUrl(undefined)
    }
    setStatusMessage(undefined)
  };

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('Creating')
    if (!file) {
        return;
    }

    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const upload_preset = process.env.UPLOAD_PRESET

    console.log(cloudinaryCloudName, upload_preset)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset',`gymsa6fa`);

    try {
      setStatusMessage('Uploading file')
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dwr4unogv/image/upload`,
        formData
      );
        console.log(response.data.secure_url);
        const groupId = selectedOption && selectedOption.value ? parseInt(selectedOption.value) : undefined;

        if (groupId !== undefined && !isNaN(groupId)) {
        const adddata = await axios.post('/api/fileupload', {
            url: response.data.secure_url,
            description,
            groupId,
        });
            console.log(adddata)
            setFileUrl(undefined)
            SetFile(undefined)
        } else {
            console.error('Invalid groupId');
        }
    } catch (error) {
      console.error(error);
      setStatusMessage('failed')
    }
    setStatusMessage('Created')
  };


  const {data: GroupData, error: GroupDatanError, isLoading: isGroupDataLoading, refetch:refetchGroupData} = useQuery<Group[]>({
    queryKey:'GroupData',
    queryFn: ()=> axios.get('/api/group').then((res) => res.data),
    staleTime:60 * 1000,
    retry:3
 })

  const transformedData = GroupData?.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  
  return (
    <div className='border p-5 rounded-lg'>
    <form onSubmit={handleSubmit}>
      <div>
        <div className='w-full h-[400px] border border-dashed rounded-md border-gray-700 relative'>  
            {fileUrl && file ? (
                <div className='flex gap-6 items-center w-full h-full overflow-hidden'>
                    {file.type.startsWith("image/") ? (
                        <div className='rounded-md overflow-hidden w-full relative'>
                            <img
                                src={fileUrl} 
                                className=''
                                alt={file.name} />
                        </div>
                    ):(
                        <div className='rounded-md overflow-hidden relative'>
                            <video className='h-full' src={fileUrl} autoPlay loop muted></video>
                        </div>
                    )}
                </div>
            ):(
            <label htmlFor="image" className='absolute top-0 left-0 bottom-0 right-0 cursor-pointer flex items-center flex-col justify-center'>
                <FiUploadCloud  className='text-3xl opacity-70' />
                <span className='block'>Click to Upload</span>
                <span className='block'>Max-size 1 MB</span>
                <input type='file' name='image' id='image' className='hidden' onChange={handleFileChange} />
            </label>
            )}
        </div>
        {fileUrl && file && (
            <div>
            <button
            type='button'
            className='border rounded-mdf px-4 py-2 block w-full mt-4 rounded-md border-gray-600 hover:opacity-60'
            onClick={()=> {setFileUrl(undefined); SetFile(undefined)}}
            >
                Remove
            </button>
            <input type="text" />
        </div>
        )} 
        <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={transformedData}
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    padding:'4px 0px 4px 0px',
                    margin:'15px 0px 4px 0px',
                    borderRadius:'5px',
                }),
            }}
            placeholder='Select Image Group'
        />
        <textarea onChange={(e) => setDescription(e.target.value)} name="" id="" rows={5} className='w-full caret-black my-5 border rounded-md p-2 focus:outline-gray-700 text-lg' placeholder='Write description'></textarea>
      </div>
      {statusmessage && (
            <div className='py-2 text-lg bg-yellow-50 rounded-md my-1 text-center'>{statusmessage}</div>
      )}
      <button className='border rounded-mdf px-4 py-2 block w-full mt-4 rounded-md bg-gray-700 text-white border-gray-600 hover:opacity-80 text-lg' type="submit">Upload</button>
    </form>
    </div>
  );
};

export default UploadForm;