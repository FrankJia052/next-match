import { MessageDto } from '@/types'
import React from 'react'
import clsx from 'clsx'

type Props = {
    message: MessageDto;
    // 用来查看信息是当前用户的还是对方用户的
    currentUserId: string;
}

export default function MessageBox({message, currentUserId}:Props) {
    const isCurrentUserSender = message.senderId === currentUserId;
  return (
    <div
        className='grid grid-rows-1'
    >
        {/* 显示头像 */}
        <div
            className={clsx('flex gap-2 mb-3', {
                'justify-end text-right': isCurrentUserSender
            })}
        >

        </div>
    </div>
  )
}
