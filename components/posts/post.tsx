"use client"
import React, { use, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { useSession } from 'next-auth/react'
import { Heart, MessageSquare, User, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'
import SkeletonPost from './skeletonPost'
import { useSearchParams } from 'next/navigation'

type PostProps = {
    key: string,
    post: any,
    comments?: any,
    unlikePost?: (id: string) => void
}

export default function Post(props: PostProps) {

    const { data: session } = useSession()
    const [likes, setLikes] = React.useState<any[]>([]);
    const [comments, setComments] = React.useState<any[]>([]);
    const searchParams = useSearchParams()
    const search = searchParams.get('show')

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

    useEffect(() => {
        // get post comments
        if (!props.post || props.comments) return;
        fetch(`/api/posts/comments?post=${props.post?.id}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });
    }, [props.post])

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
                    if (props.unlikePost && search === 'liked') {
                        props.unlikePost(props.post.id);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }

    const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
    ]


    return (
        <>
            {props.post ? (
                <>
                    <Card>
                        <CardContent className='p-4 pb-2'>
                            <Link href={'/post/' + props.post?.id}>
                                <div className='flex justify-between'>
                                    <div className='mr-4 w-10'>
                                        {props.post?.group ? (
                                            <>
                                                {props?.post?.group?.image === null && (
                                                    <div className={`h-10 w-10 rounded-lg bg-muted border text-gray-white flex items-center justify-center relative`}>
                                                        <Users />
                                                        <Avatar className=" h-7 w-7 rounded-lg absolute right-0">
                                                            <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                                                <AvatarImage src={props.post?.author?.image} />
                                                                <AvatarFallback className=' h-7 w-7 rounded-lg bg-background border'><User /></AvatarFallback>
                                                            </Link>
                                                        </Avatar>
                                                    </div>

                                                )}
                                                {props?.post?.group?.image !== null && colors.includes(props.post?.group?.image) && (
                                                    <div className={`h-10 w-10 rounded-lg relative ${props?.post?.group?.image}`}>
                                                        <Avatar className=" h-7 w-7 rounded-lg absolute -right-2 -bottom-2">
                                                            <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                                                <AvatarImage src={props.post?.author?.image} />
                                                                <AvatarFallback className=' h-7 w-7 rounded-lg bg-background border'><User /></AvatarFallback>
                                                            </Link>
                                                        </Avatar>
                                                    </div>
                                                )}

                                            </>
                                        ) : (

                                            <Avatar className=" h-10 w-10 rounded-lg">
                                                <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                                    <AvatarImage src={props.post?.author?.image} />
                                                    <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                                                </Link>
                                            </Avatar>

                                        )}


                                    </div>
                                    <div className=' w-full '>
                                        {props.post?.group ? (
                                            <>
                                                <div className='font-bold'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.group?.name}</Link></div>
                                                <div className='text-gray-400 text-sm'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.name}</Link></div>
                                            </>
                                        ) : (
                                            <>
                                                <div className='font-bold'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.name}</Link></div>
                                                <div className='text-gray-400 text-sm'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.email}</Link></div>
                                            </>
                                        )}

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
                                        {props.comments ? (
                                            <div className='text-gray-400 text-sm'>{props.comments?.length}</div>
                                        ) : (
                                            <>
                                                {comments ? (
                                                    <div className='text-gray-400 text-sm'>{comments?.length}</div>
                                                ) : (
                                                    <Skeleton className='h-4 w-4' />
                                                )}
                                            </>
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
                </>
            ) : (
                <SkeletonPost />
            )}
        </>
    )
}