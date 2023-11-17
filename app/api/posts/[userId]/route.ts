import { PrismaClient } from '@prisma/client';
import { group } from 'console';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
    try {

        if (request.method !== 'GET') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const userId = context.params.userId;
        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        let select = request.nextUrl.searchParams.get('select');
        if (!select) {
            select = 'all';
        }

        // let whereCondition = {
        //     authorId: {},
        //     groupId: {},
        // };

        // get user following
        const followingUsers = await prisma.follower.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
        });

        const followingIds = followingUsers.map((follow) => follow.following.id);



        // get user groups
        const userGroups = await prisma.group.findMany({
            where: {
                userIds: {
                    has: userId,
                },
            }
        });
        const groupIds = userGroups.map((group) => group.id);
        // ["6553b8581827eaba8ac8532f", "6553bb771827eaba8ac85338", "6553bf5e1827eaba8ac85341", "6553bf641827eaba8ac85342", "65552b299dc56ce453b5e32d", "6556639086d4d381196866bb"]
        
        
        let whereCondition: any = {};
        if (select === 'following') {
            whereCondition = {
                AND: [
                    {
                        authorId: {
                            in: followingIds,
                        },
                    },
                    {
                        group: null,
                    },
                ],
            };
        }
        else if (select === 'groups') {
            whereCondition = {
                AND: [
                    {
                        groupId: {
                            in: groupIds,
                        },
                    },
                    {
                        group: {
                            isNot: null,
                        }
                    }
                ],
            };
        }
        else if (select === 'all') {
            whereCondition = {
                OR: [
                    {
                        AND: [
                            {
                                authorId: {
                                    in: followingIds,
                                },
                            },
                            {
                                group: null,
                            },
                        ],
                    },
                    {
                        AND: [
                            {
                                groupId: {
                                    in: groupIds,
                                },
                            },
                            {
                                group: {
                                    isNot: null,
                                }
                            }
                        ],
                    },
                ],
            };
        }
        
        // whereCondition.authorId = {
        //     in: followingIds,
        // } as { in?: string[] };
        
        // whereCondition.groupId = {
        //     in: groupIds,
        // } as { in?: string[] };

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
                    }
                }
            },
        });

        return new NextResponse(JSON.stringify(posts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    }
    catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}