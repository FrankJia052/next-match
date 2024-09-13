'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserFilters } from "@/types";
import { Photo } from "@prisma/client";
import { addYears } from "date-fns";

// 重点：添加参数
export async function getMembers(searchParams: UserFilters) {
    const session = await auth()
    if(!session?.user) return null;

    const ageRange = searchParams.ageRange.toString()?.split(',') || [18, 100];
    const currentDate = new Date();
    // 拿到最低年龄的生日
    const minDob = addYears(currentDate, -ageRange[1]-1);
    // 拿到最高年龄的生日
    const maxDob = addYears(currentDate, -ageRange[0]);
    
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
        select: {photos: true}
    })

    if(!member) return null;

    return member.photos.map(p => p) as Photo[]
}