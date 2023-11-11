import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
	try {
		const userId = context.params.userId; // Extract 'userId' from the URL
		const currentUser = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!currentUser) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(currentUser);
	} catch (error) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, context: { params: { userId: string } }) {
	try {
		if (request.method !== 'PUT') {
			return new NextResponse('Method Not Allowed', { status: 405 });
		}

		const userId = context.params.userId;
		const body = await request.json();

		let data = {};

		if (body.name) {
			data = { ...data, name: body.name };
		}
		if (body.image) {
			data = { ...data, image: body.image };
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: data,
		});

		return NextResponse.json(updatedUser);


	} catch (error) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}