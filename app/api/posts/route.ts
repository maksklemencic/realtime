import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const body = await request.json();

        if (!body.content || !body.author) {
            return new NextResponse('Content and Author are required', { status: 400 });
        }

        if (body.group) {
            const newPost = await prisma.post.create({
                data: {
                    content: body.content,
                    author: { connect: { id: body.author } },
                    group: { connect: { id: body.group } },
                    imagesUrls: body.images ?? [],
                    location: body.location ?? undefined,
                },
            });

            return new NextResponse(JSON.stringify(newPost), { status: 201, headers: { 'Content-Type': 'application/json' } });
        }

        const newPost = await prisma.post.create({
            data: {
                content: body.content,
                author: { connect: { id: body.author } },
                imagesUrls: body.images ?? [],
            },
        });

        return new NextResponse(JSON.stringify(newPost), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        if (request.method !== 'GET') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        let authorId = request.nextUrl.searchParams.get('userId');
        let groupId = request.nextUrl.searchParams.get('groupId');
        let id = request.nextUrl.searchParams.get('id');
        let content = request.nextUrl.searchParams.get('content');

        // build where condition
        let whereCondition = {
            authorId: {},
            groupId: {},
            id: {},
            content: {},
        };

        if (authorId) {
            whereCondition.authorId = {
                equals: authorId,
            };
        }
        if (groupId) {
            whereCondition.groupId = {
                equals: groupId,
            };
        }
        if (id) {
            whereCondition.id = {
                equals: id,
            }
        }

        if (content) {
            whereCondition.content = {
                contains: content,
            }
        }

        const posts = await prisma.post.findMany({
            where: whereCondition,
            orderBy: [
                {
                    createdAt: 'desc',
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
                group: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return new NextResponse(JSON.stringify(posts), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}