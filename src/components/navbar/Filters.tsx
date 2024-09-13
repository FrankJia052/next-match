'use client';

import { Button, Select, SelectItem, Slider } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaFemale, FaMale } from 'react-icons/fa'

export default function Filters() {
    const pathname = usePathname();
    // 重点
    const searchParams = useSearchParams();
    const router = useRouter();

    // 为了解决label 18-100 的空格问题在服务端和客户端
    const [clientLoaded, setClientLoaded] = useState(false);
    
    useEffect(() => {
        setClientLoaded(true)
    }, [])

    const orderByList = [
        { label: 'Last active', value: 'updated' },
        { label: 'Newest members', value: 'created' }
    ]

    const genders = [
        { value: 'male', icon: FaMale },
        { value: 'female', icon: FaFemale }
    ]

    // 重点
    const handleAgeSelect = (value: number[]) => {
        const params = new URLSearchParams();
        params.set('ageRange', value.join(','));
        router.replace(`${pathname}?${params}`);
    }

    if (pathname !== '/members') return null;

    return (
        <div
            className='shadow-md py-2'
        >
            <div
                className='flex flex-row justify-around items-center'
            >
                <div
                    className='text-secondary font-semibold text-xl'
                >
                    Result: 10
                </div>
                <div
                    className='flex gap-2 items-center'
                >
                    <div>
                        Gender:
                    </div>
                    {
                        genders.map(({ icon: Icon, value }) => (
                            <Button
                                key={value}
                                size='sm'
                                isIconOnly
                                color='secondary'
                            >
                                <Icon size={24} />
                            </Button>
                        ))
                    }
                </div>
                <div
                    className='flex flex-row items-center gap-2 w-1/4'
                >
                    <Slider
                    // 这里nextUI有个bug，18-100会有空格在client side，但是在server side没有空格，区别会造成error 
                    // 解决方法：用useState和useEffect在客户端才渲染
                        label={clientLoaded && 'Age range'}
                        color='secondary'
                        size='sm'
                        minValue={18}
                        maxValue={100}
                        defaultValue={[18, 100]}
                        // 重点
                        onChangeEnd={(value) => handleAgeSelect(value as number[])}
                    />
                </div>
                <div
                    className='w-1/4'
                >
                    <Select
                        size='sm'
                        fullWidth
                        placeholder='Order by'
                        variant='bordered'
                        color='secondary'
                        aria-label='Order by selector'
                    >
                        {
                            orderByList.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))
                        }
                    </Select>
                </div>
            </div>
        </div>
    )
}
