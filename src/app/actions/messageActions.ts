'use server';

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDto } from "@/lib/mappings";

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<Message>> {
    try {
        const userId = await getAuthUserId();

        const validated = messageSchema.safeParse(data);

        if (!validated.success) return {status: 'error', error: validated.error.errors}

        const {text} = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId
            }
        });
        return {status: 'success', data: message}
    } catch (error) {
        console.log(error);
        return {status: 'error', error: 'Something went wrong'}
    }
}

export async function getMessageThread(recipientId: string) {
    try {
        const userId = await getAuthUserId();

        const messages = await prisma.message.findMany({
            where: {
                // 更改读取逻辑，如果删除不读取
                OR: [
                    {
                        senderId: userId,
                        recipientId,
                        senderDeleted: false
                    },
                    {
                        senderId: recipientId,
                        recipientId: userId,
                        recipientDeleted: false
                    }
                ]
            },
            orderBy: {
                created: 'asc'
            },
            select: {
                id: true,
                text: true,
                created: true,
                dateRead: true,
                sender: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                },
                recipient: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        // 添加当读取message线程的时候，所有的message状态改成已读
        if(messages.length > 0) {
            await prisma.message.updateMany({
                where: {
                    senderId: recipientId,
                    recipientId: userId,
                    dateRead: null,
                },
                data: {dateRead: new Date()}
            })
        }
        return messages.map(message => mapMessageToMessageDto(message))
    } catch (error) {
        console.log(error);
        throw error;        
    }
}

export async function getMessagesByContainer(container: string) {
    try {
        const userId = await getAuthUserId();

        const selector = container === 'outbox' ? 'senderId' : 'recipientId';

        // 消息如果删除，不取数据
        const conditions = {
            [container === 'outbox' ? 'senderId' : 'recipientId']: userId,
            ...(container === 'outbox' ? {senderDeleted: false} : {recipientDeleted: false})
        }

        const messages = await prisma.message.findMany({
            // 重点
            where: conditions,
            orderBy: {
                created: 'desc'
            },
            select: {
                id: true,
                text: true,
                created: true,
                dateRead: true,
                sender: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                },
                recipient: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return messages.map(message => mapMessageToMessageDto(message))
    } catch (error) {
        console.log(error);
        throw error;        
    }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
    const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted';

    try {
        const userId = await getAuthUserId();

        await prisma.message.update({
            where: {id: messageId},
            data: {
                [selector]: true
            }
        })

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        })
        
        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({id: m.id}))
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}