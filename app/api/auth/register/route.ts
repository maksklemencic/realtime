import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const {
            email,
            name,
            password
        } = body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        })
        return NextResponse.json(user);

    } catch (error: any) {
        return new NextResponse("Internal error", { status: 500});
    }
}