import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import React from 'react'
import MemberPhotoUpload from './MemberPhotoUpload';
import MemberPhotos from '@/components/MemberPhotos';

export default async function page() {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId(userId);
    const photos = await getMemberPhotosByUserId(userId);
    return (
        <>
        {/* 把上传按钮放到右侧 */}
            <CardHeader className='flex flex-row justify-between items-center'>
                <div
                    className='text-2xl font-semibold text-secondary'
                >
                    Edit Profile
                </div>
                {/* 把按钮放在这里 */}
                <MemberPhotoUpload />
            </CardHeader>
            <Divider />
            <CardBody>
                <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
            </CardBody>
        </>
    )
}
