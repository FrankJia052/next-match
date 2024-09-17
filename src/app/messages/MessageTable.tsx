'use client'
import { MessageDto } from '@/types';
import { Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React from 'react'
import MessageTableCell from './MessageTableCell';
import { useMessages } from '@/hooks/useMessages';

// messages改名initialMessages, 和useMessages重名
type Props = {
    initialMessages: MessageDto[];
    nextCursor?: string;
}

export default function MessageTable({ initialMessages, nextCursor }: Props) {
    // 更新
    const { columns, isOutbox, isDeleting, deletMessage, selectRow, messages, loadMore, loadingMore, hasMore } = useMessages(initialMessages, nextCursor);

    return (
        <div
            className='flex flex-col h-[80vh]'
        >
            <Card>
                <Table
                    aria-label='Table with messages'
                    selectionMode='single'
                    onRowAction={(key) => {
                        selectRow(key)
                    }}
                    shadow='none'
                    className='flex flex-col gap-3 h-[80vh] overflow-auto'
                >
                    <TableHeader
                        columns={columns}
                    >
                        {(column) =>
                            <TableColumn key={column.key} width={column.key === 'text' ? '50%' : undefined}>
                                {column.label}
                            </TableColumn>}
                    </TableHeader>
                    <TableBody items={messages} emptyContent='No Messages for this container'>
                        {(item) => (
                            <TableRow key={item.id} className='cursor-pointer'>
                                {(columnKey) => (
                                    <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                                        <MessageTableCell
                                            item={item}
                                            columnKey={columnKey as string}
                                            isOutbox={isOutbox}
                                            deleteMessage={deletMessage}
                                            isDeleting={isDeleting.loading && isDeleting.id === item.id}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* 重点，添加读取更多按钮 */}
                <div
                    className='sticky bottom-0 pb-3 mr-3 text-right'
                >
                    <Button
                        color='secondary'
                        isLoading={loadingMore}
                        isDisabled={!hasMore}
                        onClick={loadMore}
                    >
                        {hasMore ? 'Load more' : 'No more messages'}
                    </Button>
                </div>
            </Card>
        </div>

    )
}
