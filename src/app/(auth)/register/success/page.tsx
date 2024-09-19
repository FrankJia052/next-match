'use client'

import CardWrapper from '@/components/CardWrapper';
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa';

// 注册成功后的消息Card
export default function RegisterSuccessPage() {
    const router = useRouter();
    return (
        <CardWrapper
            headerText='You have successfully registered'
            subHeaderText='You can now login to the app'
            action={() => router.push('/lgoin')}
            actionLabel='Go to login'
            headerIcon={FaCheckCircle}
        />
    )
}
