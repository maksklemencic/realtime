import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const body = await request.json();
        if (!body.content) {
            return new NextResponse('Content is required', { status: 400 });
        }
        if (!body.author) {
            return new NextResponse('Author is required', { status: 400 });
        }
        if (!body.post) {
            return new NextResponse('Post is required', { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                text: body.content,
                author: { connect: { id: body.author } },
                post: { connect: { id: body.post } },
            },
        });

        return new NextResponse(JSON.stringify(newComment), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {

        if (request.method !== 'GET') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const author = request.nextUrl.searchParams.get('author');
        const post = request.nextUrl.searchParams.get('post');

        let whereCondition = {
            authorId: {},
            postId: {},
        };

        if (author) {
            whereCondition.authorId = {
                equals: author,
            } as { equals?: string };
        }
        if (post) {
            whereCondition.postId = {
                equals: post,
            } as { equals?: string };
        }


        const comments = await prisma.comment.findMany({
            where: whereCondition,
            orderBy: [
                {
                    createdAt: 'asc',
                },
            ],
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
        });

        return new NextResponse(JSON.stringify(comments), { status: 200, headers: { 'Content-Type': 'application/json' } });



    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}