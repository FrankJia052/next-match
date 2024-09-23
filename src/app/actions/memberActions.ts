'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GetMemberParams, PaginatedResponse } from "@/types";
import { Member, Photo } from "@prisma/client";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";

export async function getMembers({
    ageRange='18,100',
    gender='male,female',
    orderBy='updated',
    pageNumber='1',
    pageSize='12',
    // 添加参数
    withPhoto='true'
}: GetMemberParams):Promise<PaginatedResponse<Member>> {
    const userId = await getAuthUserId();

    const [minAge, maxAge] = ageRange.split(',');
    const currentDate = new Date();
    const minDob = addYears(currentDate, -maxAge - 1);
    const maxDob = addYears(currentDate, -minAge);

    const selectedGender = gender.split(',');

    const page = parseInt(pageNumber);
    const limit = parseInt(pageSize);

    const skip = (page - 1) * limit;

    //  以下是解释where里的逻辑 
    // let conditions = [
    //     {dateOfBirth: {gte: minDob}},
    //     {dateOfBirth: {lte: maxDob}},
    //     {gender: {in: selectedGender}},
    // ];

    // if (withPhoto === 'true') {
    //     conditions.push({image: {not: null}})
    // }

    try {
        const count = await prisma.member.count({
            where: {
                AND: [
                    { dateOfBirth: { gte: minDob } },
                    { dateOfBirth: { lte: maxDob } },
                    { gender: {in: selectedGender}},
                    // 重点，添加image的筛选
                    ...(withPhoto === 'true'? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                }
            },
        })

        const members = await prisma.member.findMany({
            where: {
                AND: [
                    { dateOfBirth: { gte: minDob } },
                    { dateOfBirth: { lte: maxDob } },
                    { gender: {in: selectedGender}},
                    // 重点，添加image的筛选
                    ...(withPhoto === 'true'? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                }
            },
            orderBy: {
                [orderBy]:'desc',
            },
            skip,
            take: limit
        });

        return {
            items: members,
            totalCount: count
        }
    } catch (error) {
        console.log(error)
        throw error
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
    const currentUserId = await getAuthUserId();

    const member = await prisma.member.findUnique({
        where: { userId },
        // 添加未审核图片，如果用户不是本人，无法显示
        select: { photos: {
            where: currentUserId === userId? {} : {isApproved: true}
        }}
    })

    if (!member) return null;

    // 这里的map没什么用
    // return member.photos.map(p => p) as Photo[]
    return member.photos as Photo[];
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