'use client'
import { getUnreadMessageCount } from '@/app/actions/messageActions'
import useMessageStore from '@/hooks/useMessageStore'
import { useNotificationChannel } from '@/hooks/useNotificationChannel'
import { usePresenceChannel } from '@/hooks/usePresenceChannel'
import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children, userId }: { children: ReactNode, userId: string | null }) {
  // 使用useRef来避免useEffect在开发端的restrict mode触发两次
  const isUnreadCountSet = useRef(false);
  // 使用useMessageStore hook
  const {updateUnreadCount} = useMessageStore(state => ({
    updateUnreadCount: state.updateUnreadCount
  }));

  // 创建使用updateUnreadCount的方法
  const setUnreadCount = useCallback((amount: number) => {
    updateUnreadCount(amount)
  }, [updateUnreadCount]);

  // 页面渲染的时候，使用上面的方法
  useEffect(() => {
    if(!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then(count => {
        setUnreadCount(count)
      });
      isUnreadCountSet.current = true;
    }
  }, [setUnreadCount, userId]);

  usePresenceChannel();
  useNotificationChannel(userId);
  return (
    <NextUIProvider>
      <ToastContainer position='bottom-right' hideProgressBar className='z-50' />
        {children}
    </NextUIProvider>
  )
}
