"use client"

import React, { use, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { set } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Edit, User, UserMinus, UserPlus } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { get } from 'http'
import { Skeleton } from '../ui/skeleton'


type ProfileCardProps = {
    userId: string
}

function ProfileCard(props: ProfileCardProps) {

    const { data: session } = useSession();
    const [displayUser, setDisplayUser] = React.useState<any>(null);
    const isMyUser = props.userId === session?.user?.id;

    const [followers, setFollowers] = React.useState<any[]>([]);
    const [following, setFollowing] = React.useState<any[]>([]);

    const [loading, setLoading] = React.useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        // fetch user data
        fetch(`/api/users/${props.userId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setDisplayUser(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });

        getUserFollowers();
        getUserFollowing();
    }, [])
    

    function getUserFollowers() {
        fetch(`/api/users/${props.userId}/followers`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setFollowers(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }

    function getUserFollowing() {
        fetch(`/api/users/${props.userId}/following`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setFollowing(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }

    function handleFollow() {
        if (isMyUser) {
            toast.error("You can't follow yourself");
            return;
        }
        fetch(`/api/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                followerId: session?.user?.id,
                followingId: props.userId
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setFollowers((followers) => [...followers, { id: data.followerId, name: session?.user.name, image: session?.user.image, email: session?.user.email }]);
            })
            .catch((error) => {
                console.error('Error following user:', error);
            });
    }

    function handleUnfollow() {
        if (isMyUser) {
            toast.error("Not allowed");
            return;
        }
        fetch(`/api/follow?followerId=${session?.user?.id}&followingId=${props.userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setFollowers((followers) => followers.filter((item) => item.id !== session?.user?.id));
            })
            .catch((error) => {
                console.error('Error following user:', error);
            });
    }

    function formatDate(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    return (
        <div className=''>
            <Card >
                <CardContent className='px-0 '>
                    <div className='relative'>
                        <AspectRatio ratio={5 / 1} >
                            <Image
                                src="https://images.unsplash.com/photo-1517315003714-a071486bd9ea?auto=format&fit=crop&q=80&w=1171&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Photo by Drew Beamer"
                                className="rounded-t-md object-cover"
                                fill
                            />

                        </AspectRatio>
                        <div className='absolute left-6 -bottom-6'>
                            {loading ? (
                                <Skeleton className='h-16 w-16 rounded-lg' />
                            ) : (
                                <Avatar className=" h-16 w-16 rounded-lg">
                                <AvatarImage src={displayUser?.image} />
                                <AvatarFallback className=' h-16 w-16 rounded-lg bg-background border'><User /></AvatarFallback>
                            </Avatar>
                            )}
                           
                        </div>
                        <div className="absolute right-6 -bottom-4">
                            {isMyUser ? (
                                <Link href={'/users/' + session?.user.id + '/edit'}>
                                <Button className='h-8'>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit profile
                                </Button>
                                </Link>
                            ) : (
                                <>
                                    {followers.find((item) => item.id === session?.user?.id) ? (
                                        <Button className='h-8' variant={"destructive"} onClick={() => handleUnfollow()}>
                                            <UserMinus className="mr-2 h-4 w-4" />
                                            Unfollow
                                        </Button>
                                    ) : (
                                        <Button className='h-8' onClick={() => handleFollow()}>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Follow
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-10 px-6'>
                        {loading ? (
                            <Skeleton className='h-4 w-32 ' />
                        ) : (
                            <p className='font-semibold text-lg'>{displayUser?.name}</p>
                        )}
                    </div>
                    <div className=' px-6'>
                        {loading ? (
                            <Skeleton className='h-4 w-48 mt-2' />
                        ) : (
                            <p className='text-sm text-gray-500'>{displayUser?.email}</p>
                        )}
                    </div>
                    {/* {displayUser?.bio && (
                        <Card className='mx-6 my-2 bg-gray-50 dark:bg-muted overflow-auto'>
                            <CardContent className='py-2 max-h-32 '>
                                <p className='font-semibold'>Bio</p>
                                <p className='text-sm '>{displayUser?.bio} </p>
                            </CardContent>
                        </Card >
                    )} */}
                    <div className='mx-0 md:mx-8 py-2 mt-4 flex justify-evenly'>
                        <Link href={{ pathname: `/users/${props.userId}/friends`, query: { show: 'followers' } }}
                        className='flex flex-col-reverse items-center gap-1 hover:bg-muted hover:rounded p-2 hover:cursor-pointer'>
                            <p className='text-sm font-semibold text-primary'>Followers</p>
                            {loading ? (
                                <Skeleton className='h-4 w-8 ' />
                            ) : (
                                <p className='font-bold'>{followers.length}</p>
                            )}
                        </Link>
                        <Link href={{ pathname: `/users/${props.userId}/friends`, query: { show: 'following' } }}
                        className='flex flex-col items-center gap-1 hover:bg-muted hover:rounded p-2 hover:cursor-pointer'>
                            {loading ? (
                                <Skeleton className='h-4 w-8 ' />
                            ) : (
                                <p className='font-bold'>{following.length}</p>)}
                            <p className='text-sm font-semibold text-primary'>Following</p>
                        </Link>
                    </div>

                </CardContent>
            </Card >
            <Card className='mt-4'>
                <CardContent className='p-0'>
                    <Tabs className='' defaultValue='posts'>
                        <TabsList className="grid w-full grid-cols-3">
                            <Link
                                href={{
                                    pathname: `/users/${props.userId}`,
                                    query: { show: 'posts' }
                                }}
                                className=' w-full flex justify-center'
                            >
                                <TabsTrigger value="posts" className='w-full'>Posts</TabsTrigger>
                            </Link>
                            <Link
                                href={{
                                    pathname: `/users/${props.userId}`,
                                    query: { show: 'liked' }
                                }}
                                className=' w-full flex justify-center'
                            >
                                <TabsTrigger value="liked" className='w-full'>Liked</TabsTrigger>
                            </Link>
                            <Link
                                href={{
                                    pathname: `/users/${props.userId}`,
                                    query: { show: 'comments' }
                                }}
                                className=' w-full flex justify-center'
                            >
                                <TabsTrigger value="comments" className='w-full'>Commented</TabsTrigger>
                            </Link>

                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>


        </div >

    )
}

export default ProfileCard