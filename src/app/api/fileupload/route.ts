import prisma from "@/app/prismadb";
import { NextResponse } from "next/server";
import { ImageSchema } from "@/app/ImageZod";
import crypto from "crypto";
import axios from "axios";


const generateSHA1 =(data: any) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
}

const generateSignature = (publicId: string, apiSecret: string) => {
	const timestamp = new Date().getTime();
	return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
}

export async function GET(request: Request) {  
    try {
      const Images = await prisma.image.findMany({
      });
      return NextResponse.json(Images);
    } catch (error) {
      console.error('Error getting Images', error);
      return NextResponse.error();
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { url, description, groupId } = body

    if (!url && !description && !groupId) {
      return NextResponse.json('Some fields are missing', { status: 400 });
    }

    const validate = ImageSchema.safeParse(body)

    if(validate.success === true){
        try {
            const image = await prisma.image.create({
            data: {
                url,
                description,
                groupId
            },
            });
            return NextResponse.json(image);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Error while adding image' }, { status: 500 });
        }
    }else{
        return NextResponse.json({ error: 'Data passed is not valid' }, { status: 500 });
    }
  }

  export async function DELETE(request:Request){
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json('image id is required', {status:400})
    }
    if(typeof parseInt(id) !== 'number'){
        return NextResponse.json('Invalid image id type is provided', {status:400})
    }

    try{
        const deletedimage = await prisma.image.delete({
            where:{
                id:parseInt(id,10)
            }
        })

        if(deletedimage){
            const Imageurl = deletedimage.url
            const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/
            const getPublicIdFromUrl = (url:string) => {
                const match = url.match(regex);
                return match ? match[1] : null;
              };
              
            const publicId = getPublicIdFromUrl(Imageurl)

            const handleDeleteImage = async (publicId:string) => {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const timestamp = new Date().getTime();
                const apiKey = process.env.CLOUDINARY_API_KEY;
                const apiSecret = process.env.CLOUDINARY_API_SECRET_KEY!
                const signature = generateSHA1(generateSignature(publicId, apiSecret));
                const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
              
                try {
                  const response = await axios.post(url, {
                    public_id: publicId,
                    signature: signature,
                    api_key: apiKey,
                    timestamp: timestamp,
                  });
              
                //   console.error(response);
                
              
                } catch (error) {
                  console.error(error);
                }
            };
            
            handleDeleteImage(publicId!)

        }
        return NextResponse.json(deletedimage)
    }catch(error){
        console.log(error)
        return NextResponse.json({error:'Error while deleting group'}, {status:500})
    }
}

export async function PATCH(request:Request){
    const {id,description} = await request.json()

    if(!id && !description){
        return NextResponse.json('image id and Description is required', {status:400})
    }
    if(!(typeof Number(id)==='number' || typeof String(description)==='string')){
        return  NextResponse.json("invalid input", { status : 422 });
    };

    try{
        const editimage = await prisma.image.update({
            where:{
                id:parseInt(id,10)
            },
            data:{
                description
            }
        })
        return NextResponse.json(editimage)
    }catch(error){
        console.log(error)
        return NextResponse.json({error:'Error while editing image'}, {status:500})
    }
}