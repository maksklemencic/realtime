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