import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { exit } from 'process';
import React, { ReactNode } from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    header?: string;
    body: ReactNode;
    footerButtons?: ButtonProps[];
    // 添加图片的modal
    imageModal?: boolean;
}

export default function AppModal({ isOpen, onClose, header, body, footerButtons, imageModal }: Props) {
    // 当点击外部，关闭modal, 因为原本的点击外部关闭事件被未知事件覆盖了
    const handleClose = () => {
        setTimeout(() => onClose(), 10);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement='top-center'
            classNames={{
                // 图片的model的style
                base: `${imageModal ? 'border-2 border-white' : ''}`,
                body: `${imageModal ? 'p-0' : ''}`
            }}
            motionProps={{
                variants: {
                    enter: { y: 0, opacity: 100, transition: { duration: 0.3 } },
                    exit: { y: 100, opacity: 0, transition: { duration: 0.3 } },
                }
            }}
        >
            <ModalContent>
                {
                    // 不是imageModel则显示header
                    !imageModal && <ModalHeader className='flex flex-col gap-1'>{header}</ModalHeader>
                }
                <ModalBody>{body}</ModalBody>
                {
                    // 不是imageModel则显示footer
                    !imageModal &&
                    <ModalFooter>
                        {footerButtons && footerButtons.map((props: ButtonProps, index) => (
                            <Button {...props} key={index}>
                                {props.children}
                            </Button>
                        ))}
                    </ModalFooter>
                }
            </ModalContent>
        </Modal>
    )
}
