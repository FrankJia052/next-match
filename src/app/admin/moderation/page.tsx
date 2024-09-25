import { getUnapprovedPhotos } from '@/app/actions/adminActions'
import MemberPhotos from '@/components/MemberPhotos';
import { Divider } from '@nextui-org/react';
import React from 'react'

// 避免无法渲染static页面的错误，需要告诉nextjs这是一个dynamic页面
export const dynamic = 'force-dynamic';

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();
  return (
    <div className='flex flex-col mt-10 gap-3'>
      <h3 className='text-2xl'>Photos awaiting moderation</h3>
      <Divider/>
      <MemberPhotos photos={photos} />
    </div>
  )
}
