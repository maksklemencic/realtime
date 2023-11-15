import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const author = request.nextUrl.searchParams.get('author');

        if (!author) {
            return new NextResponse('Author is required', { status: 400 });
        }

        const postWhereUsersCommented = await prisma.comment.findMany({
            where: {

                authorId: {
                    equals: author,
                },

            },
            include: {
                post: {
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
                    },
                },
            },
        });

        const posts = postWhereUsersCommented.map((post) => ({
            id: post.post.id,
            content: post.post.content,
            createdAt: post.post.createdAt,
            updatedAt: post.post.updatedAt,
            authorId: post.post.authorId,
            author: post.post.author,
            groupId: post.post.groupId,
            group: post.post.group,
        }));

        // filter out duplicate posts so posts with same id
        // are not returned
        const filteredPosts = posts.filter((post, index, self) =>
            index === self.findIndex((p) => p.id === post.id)
        );

        return new NextResponse(JSON.stringify(filteredPosts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}