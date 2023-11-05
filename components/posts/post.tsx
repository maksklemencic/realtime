"use client"
import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { useSession } from 'next-auth/react'
import { Heart, MessageSquare, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'

type PostProps = {
    key: string,
    post: any,
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

        // fetch likes
        fetch(`/api/like?postId=${props.post.id}`)
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
    }, [])

    function handleLike() {

        if (!likes.find((item: any) => (item.userId === session?.user.id))) {
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
        <Card>
            <CardContent className='p-4 pb-2'>
                <div className='flex justify-between'>
                    <div className='mr-4'>
                        <Avatar className=" h-10 w-10 rounded-lg">
                            <Link href={props.post?.authorId + '?show=posts'}>
                                <AvatarImage src={props.post?.author?.image} />
                                <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                            </Link>
                        </Avatar>
                    </div>
                    <div className=' w-full'>

                        <div className='font-bold'><Link href={props.post?.authorId + '?show=posts'}>{props.post.author.name}</Link></div>
                        <div className='text-gray-400 text-sm'><Link href={props.post?.authorId + '?show=posts'}>{props.post.author.email}</Link></div>
                        <div className='mt-4 '>
                            {props.post.content}
                        </div>
                    </div>
                </div>

                <Separator className='my-2 mt-4' />
                <div className='flex w-full justify-center'>
                    <div className='flex justify-evenly gap-4 w-4/5'>
                        <div className='text-gray-400 text-sm'>{formatDateAndTime(props.post.createdAt)}</div>
                        <div className='flex gap-2 items-center '>
                            <div className='text-gray-400 text-sm'>12</div>
                            <MessageSquare className='h-4 w-4' />
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
    )
}