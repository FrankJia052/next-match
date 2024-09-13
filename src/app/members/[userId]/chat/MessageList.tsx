'use client'
import { MessageDto } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import { pusherClient } from '@/lib/pusher';
import { formatShortDateTime } from '@/lib/util';
import { Channel } from 'pusher-js';
import useMessageStore from '@/hooks/useMessageStore';

type Props = {
    // 更新这里
    initialMessages: {messages: MessageDto[], readCount: number};
    currentUserId: string;
    chatId: string;
}

export default function MessageList({ initialMessages, currentUserId, chatId }: Props) {
    // 解决useEffect运行两遍的问题
    const setReadCount = useRef(false);
    const channelRef = useRef<Channel | null>(null)
    // 更新这里
    const [messages, setMessages] = useState(initialMessages.messages);
    // 添加useMessageStore的钩子，使用updateUnreadCount的方法
    const {updateUnreadCount} = useMessageStore(state => ({
        updateUnreadCount: state.updateUnreadCount
    }))

    // 使用useEffect来实时更新通道, 更新updateUnreadCount
    useEffect(() => {
        if(!setReadCount.current) {
            updateUnreadCount(-initialMessages.readCount)
            setReadCount.current = true
        }
    }, [initialMessages.readCount, updateUnreadCount])

    const handleNewMessage = useCallback((message: MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(
            message => messageIds.includes(message.id) ? { ...message, dateRead: formatShortDateTime(new Date()) } : message
        ))
    }, [])

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe(chatId)

            channelRef.current.bind('message:new', handleNewMessage);
            channelRef.current.bind('messages:read', handleReadMessages)
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage);
                channelRef.current.unbind('messages:read', handleNewMessage);
            }
        }
    }, [chatId, handleNewMessage, handleReadMessages])

    return (
        <div>
            {messages.length === 0 ? 'No messages to display' : (
                <div>
                    {messages.map(message => (
                        <MessageBox
                            key={message.id}
                            message={message}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
