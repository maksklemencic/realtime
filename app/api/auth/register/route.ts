import bcrypt from "bcrypt";

import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const {
            email,
            name,
            surname,
            password
        } = body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                surname,
                hashedPassword
            }
        });
        return NextResponse.json(user);

    } catch (error: any) {
        return new NextResponse("Internal error", { status: 500});
    }
}