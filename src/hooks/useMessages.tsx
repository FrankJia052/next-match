import { deleteMessage } from "@/app/actions/messageActions";
import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";
import useMessageStore from "./useMessageStore";

export const useMessages = (initialMessages:MessageDto[]) => {
    // 添加updateUnreadCount
    const {set, remove, messages, updateUnreadCount} = useMessageStore(state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount
    }))
    const searchParams = useSearchParams();
    const isOutbox = searchParams.get('container') === 'outbox';
    const router = useRouter();
    const [isDeleting, setDeleting] = useState({ id: '', loading: false })

    useEffect(() => {
        set(initialMessages)

        return () => {
            set([])
        }
    }, [initialMessages, set]);

    const columns = [
        { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
        { key: 'text', label: 'Message' },
        { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
        { key: 'actions', label: 'Actions' },
    ]

    const handleDeleteMessage = useCallback(async (message: MessageDto) => {
        setDeleting({ id: message.id, loading: true });
        await deleteMessage(message.id, isOutbox);
        // 我们的删除已经改到client端，无需refresh
        // router.refresh();
        // 发送消息删除事件
        remove(message.id);
        // 如果消息未读并且在Inbox，更新消息未读数量减1
        if(!message.dateRead && !isOutbox) {
            updateUnreadCount(-1);
        }
        setDeleting({ id: '', loading: false });
    }, [isOutbox, remove, updateUnreadCount])

    const handleRowSelect = (key: Key) => {
        const message = messages.find(m => m.id === key);
        const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`;
        router.push(url + '/chat')
    }

    return {
        isOutbox,
        columns,
        deletMessage: handleDeleteMessage,
        selectRow: handleRowSelect,
        isDeleting,
        messages
    }
}