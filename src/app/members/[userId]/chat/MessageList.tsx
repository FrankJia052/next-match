'use client'
import { MessageDto } from '@/types'
import React, { useEffect, useState } from 'react'
import MessageBox from './MessageBox';
import { pusherClient } from '@/lib/pusher';

type Props = {
    initialMessages: MessageDto[];
    currentUserId: string;
    chatId: string;
}

export default function MessageList({ initialMessages, currentUserId, chatId }: Props) {
    const [messages, setMessages] = useState(initialMessages);
    useEffect(() => {
        const channel = pusherClient.subscribe(chatId)

        // 必须满足发送的事件名字
        channel.bind('message:new', () => {});

        return () => {
            channel.unsubscribe();
            channel.unbind('message:new');
        }
    }, [])
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
