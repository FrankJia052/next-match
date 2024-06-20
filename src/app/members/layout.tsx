import React, { ReactNode } from 'react'

export default function layout({children}:{children: ReactNode}) {
  return (
    <div className='ddbg-green-600 hdd-screen'>
        {children}
    </div>
  )
}
