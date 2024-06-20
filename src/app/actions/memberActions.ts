'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Photo } from "@prisma/client";

// 显示会员列表，但是本人不显示
export async function getMembers() {
    const session = await auth()
    if(!session?.user) return null;
    
    try {
        return prisma.member.findMany({
            where: {
                NOT: {
                    userId: session.user.id
                }
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export async function getMemberByUserId(userId: string) {
    const session = await auth()
    if(!session?.user) return null;

    try {
        return prisma.member.findUnique({
            where: {
                userId
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const member = await prisma.member.findUnique({
        where: {userId},
        // 两种方法实现关联表: select or include
        select: {photos: true}
    })

    if(!member) return null;

    return member.photos.map(p => p) as Photo[]
}