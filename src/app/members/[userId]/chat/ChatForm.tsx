'use client'
import { createMessage } from '@/app/actions/messageActions'
import { messageSchema, MessageSchema } from '@/lib/schemas/messageSchema'
import { handleFormServerErrors } from '@/lib/util'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { HiPaperAirplane } from 'react-icons/hi2'

export default function ChatForm() {
    // 添加钩子
    const router = useRouter();
    // 用钩子，准备拿 user id, 必须和文件夹[userId]里的名称相同
    const params = useParams<{ userId: string }>();
    const { register, handleSubmit, reset, setError, formState: { isSubmitting, isValid, errors } } = useForm<MessageSchema>({
        resolver: zodResolver(messageSchema)
    })

    // 更新onSubmit方法
    const onSubmit = async (data: MessageSchema) => {
        const result = await createMessage(params.userId, data);
        if (result.status === 'error') {
            handleFormServerErrors(result, setError)
        } else {
            reset();
            router.refresh();
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full'
        >
            <div
                className='flex items-center gap-2'
            >
                <Input
                    fullWidth
                    placeholder='Type a message'
                    variant='faded'
                    {...register('text')}
                    isInvalid={!!errors.text}
                    errorMessage={errors.text?.message}
                />
                <Button
                    type='submit'
                    isIconOnly
                    color='secondary'
                    radius='full'
                    isLoading={isSubmitting}
                    isDisabled={!isValid || isSubmitting}
                >
                    <HiPaperAirplane size={18} />
                </Button>
            </div>
            {/* 渲染错误信息 */}
            <div
                className='flex flex-col'
            >
                {errors?.root?.serverError && (
                    <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                )}
            </div>
        </form>
    )
}
