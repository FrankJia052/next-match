import { pusherClient } from "@/lib/pusher";
import { MessageDto } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from "./useMessageStore";
// 重点
import { newLikeToast, newMessageToast } from "@/components/NotificationToast";

export const useNotificationChannel = (userId: string | null) => {
    const channelRef = useRef<Channel | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {add, updateUnreadCount} = useMessageStore(state => ({
        add: state.add,
        updateUnreadCount: state.updateUnreadCount
    }))

    const handleNewMessage = useCallback((message:MessageDto) => {
        if(pathname === '/messages' && searchParams.get('container') !== 'outbox') {
            add(message);
            updateUnreadCount(1);
        } else if (pathname !== `/members/${message.senderId}/chat`) {
            newMessageToast(message)
            updateUnreadCount(1);
        }
    }, [add, pathname, searchParams, updateUnreadCount])

    // 添加新喜欢的事件逻辑, 放到useCallback()中防止多次执行
    const handleNewLike = useCallback((data: {name:string, image:string | null, userId: string}) => {
        console.log("test 01")
        newLikeToast(data.name, data.image, data.userId)
    }, []);

    useEffect(() => {
        if(!userId) return;
        if(!channelRef.current) {
            channelRef.current = pusherClient.subscribe(`private-${userId}`);
            channelRef.current.bind('message:new', handleNewMessage);
            // 添加绑定的事件
            channelRef.current.bind('like:new', handleNewLike)
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage)
                // 一定要正确解绑！！！
                channelRef.current.unbind('like:new', handleNewLike)
                channelRef.current = null;
            }
        }
    }, [userId, handleNewMessage, handleNewLike])
}