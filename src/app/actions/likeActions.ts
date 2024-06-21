'use server'

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
    try {
        const userId = await getAuthUserId()      
        if(isLiked) {
            await prisma.like.delete({
                // 注意连个属性作为primary key的时候的查询方法
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: userId,
                        targetUserId
                    }
                }
            })
        } else {
            await prisma.like.create({
                data: {
                    sourceUserId: userId,
                    targetUserId
                } 
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function fetchCurrentUserLikeIds() {
    try {
        const userId = await getAuthUserId();

        const likeIds = await prisma.like.findMany({
            where: {
                sourceUserId: userId
            },
            select: {
                targetUserId: true
            }
        })
        // 因为likeIds返回的是对象数组，我们这里通过map, 直接返回数组
        return likeIds.map(like => like.targetUserId);
    } catch (error) {
        console.log(error)
        throw error
    }
}

// 看目标member选了哪些人作为like
export async function fetchLikedMembers(type = 'source') {
    try {
        const userId = await getAuthUserId();

        switch (type) {
            case 'source':
                
                return await fetchSourceLikes(userId);
            
            case 'target':
                return await fetchTargetLikes(userId);

            case 'mutual':
                return await fetchMutualLikes(userId);
        
            default:
                return [];
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function fetchSourceLikes(userId: string) {
    const sourceList = await prisma.like.findMany({
        where: {sourceUserId: userId},
        select: {targetMember: true}
    })
    return sourceList.map(x => x.targetMember);
}

async function fetchTargetLikes(userId: string) {
    const targetList = await prisma.like.findMany({
        where: {targetUserId: userId},
        select: {sourceMember: true}
    })
    return targetList.map(x => x.sourceMember)
}

async function fetchMutualLikes(userId: string) {
    const likedUsers = await prisma.like.findMany({
        where: {sourceUserId: userId},
        select: {targetUserId: true}
    });
    const likedId = likedUsers.map(x => x.targetUserId);

    const mutualList = await prisma.like.findMany({
        where: {
            AND: [
                {targetUserId: userId},
                {sourceUserId: {in: likedId}}
            ]
        },
        select: {sourceMember: true}
    })

    return mutualList.map(x => x.sourceMember);
}

