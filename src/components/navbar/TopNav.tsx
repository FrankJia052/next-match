import { Button, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { GiMatchTip } from 'react-icons/gi'
import NavLink from './NavLink'
import { auth } from '@/auth'
import UserMenu from './UserMenu'

export default async function TopNav() {
    const session = await auth()
    return (
        <Navbar
            maxWidth='xl'
            className='bg-gradient-to-r from-purple-400 to-purple-700'
            classNames={{
                item: [
                    'text-xl',
                    'text-white',
                    'text-uppercase',
                    'data-[active=true]:text-yellow-200'
                ]
            }}
        >
            <NavbarBrand as={Link} href="/">
                <GiMatchTip size={40} />
                <div className='font-bold text-3xl flex'>
                    <span className='text-gray-900'>Next</span>
                    <span className='text-gray-200'>Match</span>
                </div>
            </NavbarBrand>
            <NavbarContent justify='center' className='text-gray-200'>
                <NavLink href='/members' label='Matches' />
                <NavLink href='/lists' label='Lists' />
                <NavLink href='/messages' label='Messages' />
            </NavbarContent>
            <NavbarContent justify='end'>
                {
                    session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <Fragment>
                            <Button as={Link} href="/login" variant='bordered' className='text-white'>login</Button>
                            <Button variant='bordered' as={Link} href="/register" className='text-white'>register</Button>
                        </Fragment>
                    )
                }
            </NavbarContent>
        </Navbar>
    )
}
