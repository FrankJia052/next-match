'use client';
import { Tab, Tabs } from '@nextui-org/react';
import { Member } from '@prisma/client';
import { Key } from '@react-types/shared';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react'
import MemberCard from '../members/MemberCard';
import LoadingComponent from '@/components/LoadingComponent';

type Props = {
    members: Member[];
    likeIds: string[];
}

export default function ListsTab({ members, likeIds }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const tabs = [
        { id: 'source', label: "Members I have liked" },
        { id: 'target', label: "Members that like me" },
        { id: 'mutual', label: "Mutual likes" },
    ]
    function handleTabChange(key: Key) {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            params.set('type', key.toString());
            router.replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className='flex w-full flex-col mt-10 gap-5'>
            <Tabs
                aria-label='Like tabs'
                items={tabs}
                color='secondary'
                onSelectionChange={(key) => handleTabChange(key)}
            >
                {(item) => (
                    <Tab key={item.id} title={item.label}>
                        {isPending ? (
                            <LoadingComponent/>
                        ) : (
                            <>
                                {members.length > 0 ? (
                                    <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
                                        {members.map(member => (
                                            <MemberCard key={member.id} member={member} likeIds={likeIds} />
                                        ))}
                                    </div>
                                ) : (
                                    <div>No Members for this filter</div>
                                )}
                            </>
                        )}
                    </Tab>
                )}
            </Tabs>
        </div>
    )
}
