import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function LoadingComponent({label}: {label?: string}) {
  return (
    // 这里的style有console警告，我们做了调整。
    <div className='flex justify-center items-center vertical-center'>
        <Spinner 
            label={label || 'Loading...'}
            color='secondary'
            labelColor='secondary'
        />
    </div>
  )
}
