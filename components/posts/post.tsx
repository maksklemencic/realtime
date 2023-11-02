"use client"
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { useSession } from 'next-auth/react'
import { Heart, MessageSquare } from 'lucide-react'

type PostProps = {
    key: string,
    post: any,
    myPosts?: boolean,
}



export default function Post(props: PostProps) {

    const { data: session } = useSession()

    function formatDate(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    function formatDateAndTime(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }


    return (
        <Card>
            <CardContent className='p-4 pb-2'>
                <div className='flex justify-between'>
                    <div className='flex  w-full'>
                        <div className='mr-4'>
                            <img className='w-10 h-10 rounded-lg' src={props.myPosts && session?.user.image} />
                        </div>
                        <div className=' w-full'>
                            <div className='font-bold'>{props.myPosts && session?.user.name}</div>
                            <div className='text-gray-400 text-sm'>{props.myPosts && session?.user.email}</div>
                            <div className='mt-4 '>
                                {props.post.content}
                            </div>
                        </div>
                    </div>
                    <div className='text-gray-400 text-sm'>{formatDateAndTime(props.post.createdAt)}</div>
                </div>
                <div className='flex w-full justify-center mt-2'>
                    <div className='flex justify-evenly gap-4 w-4/5'>
                        <div className='flex gap-2 items-center '>
                            <div className='text-gray-400 text-sm'>4</div>
                            <Heart className='h-4 w-4' />
                        </div>
                        <div className='flex gap-2 items-center '>
                            <div className='text-gray-400 text-sm'>12</div>
                            <MessageSquare className='h-4 w-4' />
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}