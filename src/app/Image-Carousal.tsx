'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import axios from 'axios';
import { ImageT } from './types';
import { useQuery } from 'react-query';
const slides = [
    {
      url: './pp/SleeperArea.jpg',
      detail:'Sleeper Area Foundations is under excavation phase of 252 meter long and expected to be completed the excavation within week time and in parallel the leveling is on going prior to select fill material for Field density test(FDT)'
    },
    {
      url: './pp/Tank-01.jpg',
      detail:'Tank TK-01 is under preparation for lean concrete.'
    },
    {
      url: './pp/Tank-02A.jpg',
      detail:'Tank TK-02A and Tank TK-02B are awaiting finalized drawings and are currently on hold. '
    },
    {
      url: './pp/Tank-02B.jpg',
      detail:'Tank TK-02B are awaiting finalized drawings and are currently on hold. '
    },
    {
      url: './pp/Tank-05.jpg',
      detail:'Tank TK-05 is in the preparation phase for the installation of rebar for the footing, scheduled to commence on November 22.'
    },
    {
      url: './pp/Tank-06A.jpg',
      detail:'Tank TK-06A has completed the lean concrete phase.'
    },
    {
      url: './pp/Tank-06B.jpg',
      detail:'Tank TK-06B has completed the lean concrete phase.'
    },
    {
      url: './pp/Tank-08.jpg',
      detail:'Tank TK-08 is under preparation for lean concrete scheduled on November 23.'
    },
    {
      url: './pp/Tank-20.jpg',
      detail:'Tank TK-20 is under preparation for lean concrete scheduled on November 23.'
    },
    {
      url: './pp/Tank-41A.jpg',
      detail:'Tank TK-41A completed its footing concrete on November 20. Currently, rebar installation for the ring wall is underway, preceding the pouring of concrete for the ring wall.'
    },
    {
      url: './pp/Tank-41B.jpg',
      detail: 'Tank TK-41B is in the preparation phase for pouring concrete for the footing, scheduled for November 23.'
    },
    {
      url: './pp/Tank-95.jpg',
      detail:'Tank TK-95 is in the preparation phase for the installation of rebar for the footing, scheduled to commence on November 23.'
    },
  ];

  
  function App() {
  const {data: ImageData, error: ImageDatanError, isLoading: isImageDataLoading, refetch:refetchImageData} = useQuery<ImageT[]>({
    queryKey:'ImageData',
    queryFn: ()=> axios.get('/api/fileupload').then((res) => res.data),
    staleTime:60 * 1000,
    retry:3
 })

 console.log(ImageData)
  return (
    <div className='max-w-[80%] h-[700px] w-full m-auto px-4 py-10 relative group'>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper" spaceBetween={10}>
      {ImageData?.map((slide,slidIndex) => (
        <SwiperSlide key={slidIndex}>
            <img className='rounded-2xl h-[700px] w-full' src={slide.url} alt={slide.description} />
            <p className='fixed z-20 py-5 -bottom-0 w-full text-center bg-white opacity-80 font-medium text-xl'>{slide.description}</p>
        </SwiperSlide>
      ))}
      </Swiper>
    </div>
  );
}

export default App;
