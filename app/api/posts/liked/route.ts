import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const author = request.nextUrl.searchParams.get('author');

        if (!author) {
            return new NextResponse('Author is required', { status: 400 });
        }

        const likes = await prisma.like.findMany({
            where: {
                userId: {
                    equals: author,
                },
            },
            include: {
                likedPost: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                        authorId: true,
                        author: {
                            select: {
                                name: true,
                                image: true,
                                email: true,
                            },
                        },
                        groupId: true,
                        group: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                        imagesUrls: true,
                        location: true,
                    },
                },
            },
        });

        const likedPosts = likes.map((like) => ({
            id: like.likedPost.id,
            content: like.likedPost.content,
            createdAt: like.likedPost.createdAt,
            updatedAt: like.likedPost.updatedAt,
            authorId: like.likedPost.authorId,
            author: like.likedPost.author,
            groupId: like.likedPost.groupId,
            group: like.likedPost.group,
            imagesUrls: like.likedPost.imagesUrls,
            location: like.likedPost.location,
        }));

        return new NextResponse(JSON.stringify(likedPosts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}