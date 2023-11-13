import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest ) {
	try {
		
        const query = request.nextUrl.searchParams.get('query');

        // return users that math the query in name or email
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query ?? undefined,
                        },
                    },
                    {
                        email: {
                            contains: query ?? undefined,
                        },
                    },
                ],
            },
        });
        

        return new NextResponse(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

		
	} catch (error) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}