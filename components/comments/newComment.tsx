"use client"

import React from 'react'
import { Input } from '../ui/input'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { SendHorizontal, User } from 'lucide-react'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

interface NewCommentProps {
    postId: number,
    addComment: (comment: any) => void,
}

function NewComment(props: NewCommentProps) {
    const { data: session } = useSession()

    const [content, setContent] = React.useState<string>('');
    
    function postComment() {
        if (content.length === 0) {
            toast.error('Comment cannot be empty!');
            return;
        }
        toast.promise(
            fetch(`/api/posts/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: session?.user?.id,
                    post: props?.postId,
                    content: content,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then((data) => {
                    setContent('');
                    props.addComment(data);
                })
                .catch((error) => {
                    console.error('Error fetching likes:', error);
                }),
         {
            loading: 'Posting comment ...',
            success: () => {
                
                return 'Comment posted!'
            },
            error: (err) => {
                return err.message
            },
        });
    }

    return (
        <div className='flex gap-2 justify-between mt-4'>
            <Avatar className=" h-10 w-10 rounded-lg">
                <Link href={'http://localhost:3000/users/' + session?.user?.id + '?show=posts'}>
                    <AvatarImage src={session?.user?.image} />
                    <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                </Link>
            </Avatar>
            <Input
                type='text'
                placeholder='Write a comment...'
                className='w-full'
                onChange={(e) => setContent(e.target.value)}
                value={content}
            />
            <Button disabled={content.length===0} size={'icon'} className='w-12' onClick={() => postComment()}><SendHorizontal/></Button>
        </div>
    )
}

export default NewComment