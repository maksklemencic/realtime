import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest ) {
	try {
		
        const query = request.nextUrl.searchParams.get('query');
        const id = request.nextUrl.searchParams.get('id');

        // return users that math the query in name or email, if there is id only return the user with that id
        const users = await prisma.user.findMany({
            where: {
                id: id ? id : undefined,
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