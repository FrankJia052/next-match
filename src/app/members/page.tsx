import React from 'react'
import { getMembers } from '../actions/memberActions'
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';
import PaginationComponent from '@/components/PaginationComponent';
import { UserFilters } from '@/types';

export default async function MembersPage({searchParams}:{searchParams: UserFilters}) {
  // 重点，改了方法，需要传参
  const members = await getMembers(searchParams);
  const likeIds = await fetchCurrentUserLikeIds();
  return (
    <>
      <div className='mt-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
        {members && members.map(member => (
          <MemberCard member={member} key={member.id} likeIds={likeIds} />
        ))}
      </div>
      <PaginationComponent/>
    </>
  )
}
