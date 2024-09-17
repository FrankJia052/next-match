import { deleteMessage, getMessagesByContainer } from "@/app/actions/messageActions";
import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import useMessageStore from "./useMessageStore";

export const useMessages = (initialMessages:MessageDto[], nextCursor?: string) => {
    // 把参数中的 nextCursor 绑定到ref，避免一些useEffect的多次调用
    const cursorRef = useRef(nextCursor);
    // 添加 resetMessages
    const {set, remove, messages, updateUnreadCount, resetMessages} = useMessageStore(state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages
    }))
    const searchParams = useSearchParams();
    const isOutbox = searchParams.get('container') === 'outbox';
    const router = useRouter();
    // 添加container的params
    const container = searchParams.get('container');
    // 重点
    const [loadingMore, setLoadingMore] = useState(false);

    const [isDeleting, setDeleting] = useState({ id: '', loading: false })

    useEffect(() => {
        set(initialMessages)
        // 绑定ref，初始化的ref什么都不是
        cursorRef.current = nextCursor;

        // 把return方法完善
        return () => {
            resetMessages();
        }
    }, [initialMessages, resetMessages, set, nextCursor]);

    // 重点
    const loadMore = useCallback(async () => {
        if (cursorRef.current) {
            setLoadingMore(true);
            const {messages, nextCursor} = await getMessagesByContainer(container, cursorRef.current)
            set(messages);
            cursorRef.current = nextCursor
            setLoadingMore(false)
        }
    }, [container, set])

    const columns = [
        { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
        { key: 'text', label: 'Message' },
        { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
        { key: 'actions', label: 'Actions' },
    ]

    const handleDeleteMessage = useCallback(async (message: MessageDto) => {
        setDeleting({ id: message.id, loading: true });
        await deleteMessage(message.id, isOutbox);

        remove(message.id);
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
        messages,
        loadMore,
        loadingMore,
        // 决定是否有更多的数据可读取，帮按钮决定是否可点
        hasMore: !!cursorRef.current
    }
}