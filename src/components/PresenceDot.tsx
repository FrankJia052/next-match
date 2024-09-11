'use client'
import usePresenceStore from '@/hooks/usePresenceStore';
import { Member } from '@prisma/client'
import React from 'react'
import { GoDot, GoDotFill } from 'react-icons/go';

type Props = {
    member: Member;
}

// 指示器显示用户是否在线
export default function PresenceDot({ member }: Props) {
    const {members} = usePresenceStore(state => ({
        members: state.members
    }))

    // indexOf会查询参数在数组中的index，未找到则返回-1
    const isOnline = members.indexOf(member.userId) !== -1;

    if (!isOnline) return null

    return (
        <>
            <GoDot size={36} className='fill-white absolute -top-[2px] -right-[2px] z-10'/>
            <GoDotFill size={36} className='fill-green-500 animate-pulse'/>
        </>
    )
}
