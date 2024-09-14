'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserFilters } from "@/types";
import { Photo } from "@prisma/client";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";

export async function getMembers(searchParams: UserFilters) {
    const session = await auth()
    if (!session?.user) return null;

    const ageRange = searchParams?.ageRange?.toString()?.split(',') || [18, 100];
    const currentDate = new Date();
    // for age period
    const minDob = addYears(currentDate, -ageRange[1] - 1);
    const maxDob = addYears(currentDate, -ageRange[0]);
    //  for sort
    const orderBySelector = searchParams?.orderBy ?? 'updated';
    // for gender filter
    const selectedGender = searchParams?.gender?.toString()?.split(',') || ['male', 'female']

    try {
        return prisma.member.findMany({
            where: {
                AND: [
                    { dateOfBirth: { gte: minDob } },
                    { dateOfBirth: { lte: maxDob } },
                    // 重点
                    { gender: {in: selectedGender}}
                ],
                NOT: {
                    userId: session.user.id
                }
            },
            orderBy: {
                [orderBySelector]:'desc'
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export async function getMemberByUserId(userId: string) {
    const session = await auth()
    if (!session?.user) return null;

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
        where: { userId },
        select: { photos: true }
    })

    if (!member) return null;

    return member.photos.map(p => p) as Photo[]
}

export async function updateLastActive() {
    const userId = await getAuthUserId();

    try {
        return prisma.member.update({
            where: {userId},
            data: {updated: new Date()}
        })
    } catch (error) {
        console.log(error);
        throw error;        
    }
}