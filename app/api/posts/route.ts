import { Prisma, PrismaClient } from '@prisma/client';
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

        // Create a new post using Prisma
        const newPost = await prisma.post.create({
            data: {
                content: body.content,
                author: { connect: { id: body.author } }, // Assuming 'author' is the ID of the user
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
        const content = request.nextUrl.searchParams.get('content');
        const author = request.nextUrl.searchParams.get('author');
        const id = request.nextUrl.searchParams.get('id');

        const posts = await prisma.post.findMany({
            where: {
                content: {
                    contains: content ?? undefined,
                },
                authorId: {
                    equals: author ?? undefined,
                },
                id: {
                    equals: id ?? undefined,
                },
            },
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
            },
        });

        return new NextResponse(JSON.stringify(posts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}