'use server';

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDto } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDto } from "@/lib/mappings";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";

// 创建message的时候，需要push到PUSHER,更改数据拿到更多sender和recipient的数据
export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDto>> {
    try {
        const userId = await getAuthUserId();

        const validated = messageSchema.safeParse(data);

        if (!validated.success) return { status: 'error', error: validated.error.errors }

        const { text } = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId
            },
            select: messageSelect
        });

        const messageDto = mapMessageToMessageDto(message)

        // 把messageDto push到PUSHER
        // 参数1是两个user id
        // 参数2是event name
        // 参数3是数据
        await pusherServer.trigger(createChatId(userId, recipientUserId), 'message:new', messageDto);

        return { status: 'success', data: messageDto }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

export async function getMessageThread(recipientId: string) {
    try {
        const userId = await getAuthUserId();

        const messages = await prisma.message.findMany({
            where: {
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
            // 更改：直接使用变量
            select: messageSelect
        })

        if (messages.length > 0) {
            await prisma.message.updateMany({
                where: {
                    senderId: recipientId,
                    recipientId: userId,
                    dateRead: null,
                },
                data: { dateRead: new Date() }
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

        const conditions = {
            [container === 'outbox' ? 'senderId' : 'recipientId']: userId,
            ...(container === 'outbox' ? { senderDeleted: false } : { recipientDeleted: false })
        }

        const messages = await prisma.message.findMany({
            where: conditions,
            orderBy: {
                created: 'desc'
            },
            // 更改：直接使用变量
            select: messageSelect
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
            where: { id: messageId },
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
                    OR: messagesToDelete.map(m => ({ id: m.id }))
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// 创建这个，避免重复创建
const messageSelect = {
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