import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import absoluteUrl from 'next-absolute-url'

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    // const authMiddleware = await withAuth({
    //     pages: {
    //         signIn: `/login`,
    //     },
    // });

    // // @ts-expect-error
    // return authMiddleware(req, event);
    
    if (!isAuthenticated) {
        return NextResponse.redirect('http://localhost:3000/login');
    }

    // User is authenticated, continue to the requested page
    return NextResponse.next();
}

export const config = {
    matcher: ['/home']
}