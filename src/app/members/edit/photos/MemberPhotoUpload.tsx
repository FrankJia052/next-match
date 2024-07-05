"use client"
import { addImage } from '@/app/actions/userActions';
import ImageUploadButton from '@/components/ImageUploadButton';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify';

export default function MemberPhotoUpload() {
    const router = useRouter();
    const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
        // 确保 result info 不是 undefind 并且是个对象
        if(result.info && typeof result.info === "object") {
            await addImage(result.info.secure_url, result.info.public_id);
            router.refresh();
        } else {
            toast.error("Problem adding image");
        }
    }
    return (
        <div className='pt-5 pl-5'>
            <ImageUploadButton onUploadImage={onAddImage}/>
        </div>
    )
}
