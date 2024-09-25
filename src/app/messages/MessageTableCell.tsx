import PresenceAvatar from '@/components/PresenceAvatar'
import { truncateString } from '@/lib/util'
import { MessageDto } from '@/types'
import React, { Children } from 'react'
import { Button, ButtonProps, useDisclosure } from '@nextui-org/react'
import { AiFillDelete } from 'react-icons/ai'
import AppModal from '@/components/AppModal'

type Props = {
    item: MessageDto;
    columnKey: string;
    isOutbox: boolean;
    deleteMessage: (message: MessageDto) => void;
    isDeleting: boolean;
}

export default function MessageTableCell({ item, columnKey, isOutbox, deleteMessage, isDeleting }: Props) {
    const cellValue = item[columnKey as keyof MessageDto]
    // 重点：这个是nextui中控制modal开关的hook
    const { isOpen, onOpen, onClose } = useDisclosure();
    // 定义删除消息事件
    const onConfirmDeleteMessage = () => {
        deleteMessage(item);
    }
    // modal中的按钮
    const footerButtons:ButtonProps[] = [
        {color: 'default', onClick: onClose, children: 'Cancel'},
        {color: 'secondary', onClick: onConfirmDeleteMessage, children: 'Confirm'},
    ]



    switch (columnKey) {
        case 'recipientName':
        case 'senderName':
            return (
                <div className='flex items-center gap-2 cursor-pointer'>
                    <PresenceAvatar
                        userId={isOutbox ? item.recipientId : item.senderId}
                        src={isOutbox ? item.recipientImage : item.senderImage}
                    />
                    <span>{cellValue}</span>
                </div>
            )
        case 'text':
            return (
                <div>
                    {truncateString(cellValue, 10)}
                </div>
            )
        case 'created':
            return cellValue

        default:
            return (
                // 把modal放进去
                <>
                    <Button isIconOnly variant='light'
                        // onClick={() => deleteMessage(item)}
                        onClick={() => onOpen()}
                        isLoading={isDeleting}
                    >
                        <AiFillDelete size={24} className='text-danger' />
                    </Button>
                    <AppModal
                        isOpen={isOpen}
                        onClose={onClose}
                        header='Please confirm this action'
                        body={<div>Are you sure you want to delete this message? This cannot be undone.</div>}
                        footerButtons={footerButtons}
                    />
                </>
            )
    }
}
