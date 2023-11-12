import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { User } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

interface CommentProps {
    comment: any
}

function formatDateAndTime(date: string) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
    return new Date(date).toLocaleDateString('de-DE', options);
}

export default function Comment(props: CommentProps) {
  return (
    <div className='flex gap-2'>
        <Avatar className=" h-10 w-10 rounded-lg">
                <Link href={'http://localhost:3000/users/' + props.comment?.authorId + '?show=posts'}>
                    <AvatarImage src={props.comment?.author?.image} />
                    <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                </Link>
        </Avatar>
        <Card className='w-full'>
            <CardContent className='py-2 px-3'>
                <div className='flex justify-between items-center'>
                    <p className='font-semibold text-sm'>{props.comment?.author?.name}</p>
                    <p className='text-gray-400 text-xs'>{formatDateAndTime(props.comment?.createdAt)}</p>
                </div>
                <p className='text-sm'>{props.comment?.text}</p>
            </CardContent>
        </Card>
    </div>
  )
}