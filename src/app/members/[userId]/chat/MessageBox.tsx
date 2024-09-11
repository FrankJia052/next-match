'use client'
import { MessageDto } from '@/types'
import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Avatar } from '@nextui-org/react';
import { timeAgo, transformImageUrl } from '@/lib/util';

type Props = {
    message: MessageDto;
    // 用来查看信息是当前用户的还是对方用户的
    currentUserId: string;
}

export default function MessageBox({ message, currentUserId }: Props) {
    const isCurrentUserSender = message.senderId === currentUserId;
    // 用hook来把消息固定在最下面，最新的消息
    const messageEndRef = useRef<HTMLDivElement>(null);
    // 确保消息在最新的位置
    useEffect(() => {
        if(messageEndRef.current) messageEndRef.current.scrollIntoView({behavior: 'smooth'})
    }, [messageEndRef])

    const renderAvatar = () => (
        <Avatar
            name={message.senderName}
            // 对齐到父元素的右侧
            className='self-end'
            src={transformImageUrl(message.senderImage) || '/images/user.png'}
        />
    )

    // 渲染消息的header
    const renderMessageHeader = () => (
        <div
            className={clsx('flex items-center w-full', {
                'justify-between': isCurrentUserSender
            })}
        >
            {message.dateRead && message.recipientId !== currentUserId ? (
                <span
                    className='text-xl text-black text-italic'
                >
                    (Read {timeAgo(message.dateRead)})
                </span>
            ):<div></div>}
            <div
                className='flex'
            >
                <span
                    className='text-sm font-semibold text-gray-900'
                >
                    {message.senderName}
                </span>
                <span
                    className='text-sm text-gray-500 ml-2'
                >
                    {message.created}
                </span>
            </div>
        </div>
    )

    // 消息渲染style
    const messageContentClasses = clsx(
        'flex flex-col w-[50%] px-2 py-1',
        {
            'rounded-l-xl rounded-tr-xl text-white bg-blue-100': isCurrentUserSender,
            'rounded-r-xl rounded-tl-xl border-gray-200 bg-green-100': !isCurrentUserSender
        }
    )
    const renderMessageContent = () => (
        <div
            className={messageContentClasses}
        >
            {renderMessageHeader()}
            <p
                className='text-sm py-3 text-gray-900'
            >
                {message.text}
            </p>
        </div>
    )

    return (
        <div
            className='grid grid-rows-1'
        >
            {/* 消息位置 */}
            <div
                className={clsx('flex gap-2 mb-3', {
                    'justify-end text-right': isCurrentUserSender,
                    'justify-start': !isCurrentUserSender
                })}
            >
                {/* 显示头像 */}
                {!isCurrentUserSender && renderAvatar()}
                {/* 消息内容 */}
                {renderMessageContent()}
                {isCurrentUserSender && renderAvatar()}
            </div>
            {/* 这个ref确保显示最后的消息 */}
            <div ref={messageEndRef}/>
        </div>
    )
}
