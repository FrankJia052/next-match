import { Prisma } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> = {status: "success", data: T} | {status: "error", error: string | ZodIssue[]}

// flatten message data
type MessageDto = {
    id: string;
    text: string;
    created: string;
    dateRead: string | null;
    senderId?: string;
    senderName?: string;
    senderImage?: string | null;
    recipientId?: string;
    recipientName?: string;
    recipientImage?: string | null;
}

// 因为mapping的Message在prisma中type只有一层，我们需要更深的访问到sender和recipient
// 所以我们只能自定义一个type, 注意这里巧用prisma的type来扩展Message type
// 一定要和messageAction中getMessageThread拿取数据的结构一样
type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
    select: {
        id: true,
        text: true,
        created: true,
        dateRead: true,
        sender: {
            select: {userId, name, image}
        },
        recipient: {
            select: {userId, name, image}
        }
    }
}>