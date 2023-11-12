"use client"
import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { useSession } from 'next-auth/react'
import { Heart, MessageSquare, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'
import SkeletonPost from './skeletonPost'

type PostProps = {
    key: string,
    post: any,
    comments?: any,
}

export default function Post(props: PostProps) {

    const { data: session } = useSession()
    const [likes, setLikes] = React.useState<any[]>([]);

    function formatDate(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    function formatDateAndTime(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    useEffect(() => {
        if (!props.post) return;
        fetch(`/api/like?postId=${props.post?.id}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setLikes(data);
            })
            .catch((error) => {
                console.error('Error fetching likes:', error);
            });
    }, [props.post?.id])

    function handleLike() {

        if (!likes.find((item: any) => (item.userId === session?.user?.id))) {
            fetch(`/api/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: props.post.id,
                    userId: session?.user?.id
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then((data) => {
                    setLikes((likes) => [...likes, data]);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
        else {
            fetch(`/api/like?postId=${props.post.id}&userId=${session?.user?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then((data) => {
                    setLikes((likes) => likes.filter((item) => item.userId !== session?.user?.id));
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }


    return (
        <>
            {props.post ? (
                <Card>
                    <CardContent className='p-4 pb-2'>
                        <Link href={'/post/' + props.post?.id}>
                            <div className='flex justify-between'>
                                <div className='mr-4'>
                                    <Avatar className=" h-10 w-10 rounded-lg">
                                        <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                            <AvatarImage src={props.post?.author?.image} />
                                            <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                                        </Link>
                                    </Avatar>
                                </div>
                                <div className=' w-full'>

                                    <div className='font-bold'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.name}</Link></div>
                                    <div className='text-gray-400 text-sm'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.email}</Link></div>
                                    <div className='mt-4 '>
                                        {props.post?.content}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Separator className='my-2 mt-4' />
                        <div className='flex w-full justify-center'>
                            <div className='flex justify-evenly gap-4 w-4/5'>
                                <div className='text-gray-400 text-sm'>{formatDateAndTime(props.post?.createdAt)}</div>
                                <div className='flex gap-2 items-center '>
                                    {props.comments || props.comments?.length === 0 ? (
                                        <div className='text-gray-400 text-sm'>{props.comments?.length}</div>
                                    ) : (
                                        <Skeleton className='h-4 w-4' />
                                    )}
                                    
                                    <MessageSquare className={`h-4 w-4 text-blue-400`} />
                                </div>
                                <div
                                    className={`flex gap-2 items-center text-red-500 hover:text-red-700 hover:cursor-pointer`}
                                    onClick={() => handleLike()}
                                >
                                    <div className='text-gray-400 text-sm'>{likes.length}</div>
                                    <Heart className={`h-4 w-4 ${likes.find((item: any) => (item.userId === session?.user.id)) && 'fill-red-500'}`} />
                                </div>

                            </div>
                        </div>

                    </CardContent>
                </Card >
            ) : (
                <SkeletonPost />
            )}
        </>
    )
}