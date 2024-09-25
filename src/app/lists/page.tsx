import React from 'react'
import ListsTab from './ListsTab'
import { fetchCurrentUserLikeIds, fetchLikedMembers } from '../actions/likeActions'

// 避免无法渲染static页面的错误，需要告诉nextjs这是一个dynamic页面
export const dynamic = 'force-dynamic';

export default async function ListsPage({searchParams}: {searchParams: {type: string}}) {
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(searchParams.type)
  return (
    <div>
      <ListsTab members={members} likeIds={likeIds}/>
    </div>
  )
}
