import { Button } from '@nextui-org/react'
import React from 'react'
import { FaGithub } from 'react-icons/fa';
import {FcGoogle} from 'react-icons/fc'
// 注意这里signin的引入不是我们自定义的
import {signIn} from 'next-auth/react'

export default function SocialLogin() {    
    const onClick = (provider: 'google' | 'github') => {
        signIn(provider, {
            // 这里当授权成功后，会跳转到的界面
            callbackUrl: '/members'
        })
    }

    return (
        <div
            className='flex items-center w-full gap-2'
        >
            <Button
                size='lg'
                fullWidth
                variant='bordered'
                onClick={() => onClick('google')}
            >
                <FcGoogle size={20}/>
            </Button>
            <Button
                size='lg'
                fullWidth
                variant='bordered'
                onClick={() => onClick('github')}
            >
                <FaGithub size={20}/>
            </Button>
        </div>
    )
}
