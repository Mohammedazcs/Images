"use server"
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import crypto from "crypto"

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const s3 = new S3Client({
    region:process.env.AWS_BUCKET_REGION!,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
})

const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm"
]

const MaxFileSize = 1024 * 1024 * 20 // 20 MB

export async function getSignedURL(type:string, size:number, checksum:string){
    if(!acceptedTypes.includes(type)){
        return {failure: "Invalid File Type"}
    }
    if(size > MaxFileSize){
        return {failure: "File is too large"}
    }
    const putObjectCommand = new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME!,
        Key: generateFileName(),
        ContentType:type,
        ContentLength:size,
        ChecksumSHA256:checksum,
        Metadata:{
            userId:"3"
        }
    })

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
        expiresIn:60
    })
    return {success: {url:signedUrl}}
}