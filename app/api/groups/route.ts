import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        if (request.method !== 'GET') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const name = request.nextUrl.searchParams.get('name');

        // build where condition
        let whereCondition = {
            name: {},
        };
        if (name) {
            whereCondition.name = {
                contains: name,
            };
        }

        const groups = await prisma.group.findMany({
            where: whereCondition,
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
            include: {
                users: true,
            },
        });

        return new NextResponse(JSON.stringify(groups), { status: 200, headers: { 'Content-Type': 'application/json' } });


    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}