"use client"

import React, { useEffect } from 'react'
import Comment from './comment';
import { Skeleton } from '../ui/skeleton';

interface DisplayCommentsProps {
    postId: string;
}

export default function DisplayComments(props: DisplayCommentsProps) {
    const [comments, setComments] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/posts/comments?postId=${props.postId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setComments(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });
    }, [])

    return (
        <div className='space-y-4 mt-6'>
            {loading ? (
                <>
                <Skeleton className='h-14 w-full'/>
                <Skeleton className='h-14 w-full'/>
                </>
            ) : (
                <>
                    {comments.map((comment) => (
                        <Comment comment={comment} key={comment?.id} />
                    ))}
                </>
            )}
        </div>
    )
}