'use client'

import { DatePicker, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { format, subYears } from 'date-fns';
import React from 'react'
import { useFormContext } from 'react-hook-form';

export default function ProfileForm() {
    // 注意useFormContext的使用方法
    const { register, getValues, setValue, formState: { errors } } = useFormContext();

    const genderList = [
        {label: 'Male', value: 'male'},
        {label: 'Female', value: 'female'}
    ]

    return (
        <div
            className='space-y-4'
        >
            <Select
                defaultSelectedKeys={getValues('gender')}
                aria-label='Select gender'
                label="Gender"
                variant="bordered"
                {...register("gender")}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message as string}
                onChange={e => setValue('gender', e.target.value)}
            >
                {genderList.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </Select>
            <Input
                defaultValue={getValues('dateOfBirth')}
                label="Date of birth"
                variant="bordered"
                // 防止日期打开之后显示的太近期,这里设置最大日期为18年前
                max={format(subYears(new Date(), 18), 'yyyy-MM-dd')}
                // 这里限制一下type
                type='date'
                {...register("dateOfBirth")}
                isInvalid={!!errors.dateOfBirth}
                errorMessage={errors.dateOfBirth?.message as string}
            />
            <Textarea
                defaultValue={getValues('description')}
                label="Description"
                variant="bordered"
                {...register("description")}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message as string}
            />
            <Input
                defaultValue={getValues('city')}
                label="city"
                variant="bordered"
                {...register("city")}
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message as string}
            />
            <Input
                defaultValue={getValues('country')}
                label="country"
                variant="bordered"
                {...register("country")}
                isInvalid={!!errors.country}
                errorMessage={errors.country?.message as string}
            />
        </div>
    )
}
