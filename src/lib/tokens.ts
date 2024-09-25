import { TokenType } from "@prisma/client";
// import { randomBytes } from "crypto";
import { prisma } from "./prisma";

export async function getTokenByEmail(email: string) {
    try {
        return prisma.token.findFirst({
            where: {email}
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function generateToken(email: string, type: TokenType) {
    // 这里用randomBytes build会出错，说not supported in the Edge Runtime，我们用别的方法实现
    // const token = randomBytes(48).toString('hex');
    // 下面的方法可以提供random string compatible with the edge runtime
    const arrayBuffer = new Uint8Array(48);
    crypto.getRandomValues(arrayBuffer);
    const token = Array.from(arrayBuffer, byte => byte.toString(16).padStart(2, '0')).join('');

    const expires = new Date(Date.now() + 1000 * 60 * 60 *24);

    const existingToken = await getTokenByEmail(email);

    if (existingToken) {
        await prisma.token.delete({
            where: {id: existingToken.id}
        })
    }

    return prisma.token.create({
        data: {
            email,
            token,
            expires,
            type
        }
    })
}

export async function getTokenByToken(token: string) {
    try {
        return prisma.token.findFirst({
            where: {token}
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}