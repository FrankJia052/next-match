'use client'

import { Input } from '@nextui-org/react'
import React from 'react'
import { useFormContext } from 'react-hook-form'

export default function UserDetailsForm() {
    // 注意useFormContext的使用方法
    const {register, getValues, formState:{errors}} = useFormContext();
    return (
        <div
            className='space-y-4'
        >
            <Input
            // 退回的时候，保留之前录入的信息
                defaultValue={getValues('name')}
                label="Name"
                variant="bordered"
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message as string}
            />
            <Input
                defaultValue={getValues('email')}
                label="Email"
                variant="bordered"
                {...register("email")}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message as string}
            />
            <Input
                defaultValue={getValues('password')}
                label="Password"
                variant="bordered"
                type="password"
                {...register("password")}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message as string}
            />
        </div>
    )
}
