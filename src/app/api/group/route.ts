import prisma from "@/app/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {  
    try {
      const groups = await prisma.group.findMany({
      });
      return NextResponse.json(groups);
    } catch (error) {
      console.error('Error getting groups', error);
      return NextResponse.error();
    }
}
  
export async function POST(request: Request) {
  const { name } = await request.json();

  // Validate the branch name (e.g., must not be empty)
  if (!name) {
    return NextResponse.json('groups name is required', { status: 400 });
  }

  try {
    const group = await prisma.group.create({
      data: {
        name,
      },
    });
    return NextResponse.json(group);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error while adding group' }, { status: 500 });
  }
}

export async function DELETE(request:Request){
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json('groups id is required', {status:400})
    }
    if(typeof parseInt(id) !== 'number'){
        return NextResponse.json('Invalid groups id type is provided', {status:400})
    }

    try{
        const deletedgroup = await prisma.group.delete({
            where:{
                id:parseInt(id,10)
            }
        })
        return NextResponse.json(deletedgroup)
    }catch(error){
        console.log(error)
        return NextResponse.json({error:'Error while deleting group'}, {status:500})
    }
}

export async function PATCH(request:Request){
    const {id,name} = await request.json()

    if(!id && !name){
        return NextResponse.json('group id and Name is required', {status:400})
    }
    if(!(typeof Number(id)==='number' || typeof String(name)==='string')){
        return  NextResponse.json("invalid input", { status : 422 });
    };

    try{
        const editgroups = await prisma.group.update({
            where:{
                id:parseInt(id,10)
            },
            data:{
                name
            }
        })
        return NextResponse.json(editgroups)
    }catch(error){
        console.log(error)
        return NextResponse.json({error:'Error while editing groups'}, {status:500})
    }
}
