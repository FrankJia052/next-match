'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import Filters from './navbar/Filters';

// fillter 有条件渲染
export default function FiltersWrapper() {
    const pathname = usePathname();

    if(pathname === '/members') return <Filters />
    else return null;
}
