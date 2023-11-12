"use client"

import React, { useEffect } from 'react'
import Comment from './comment';
import { Skeleton } from '../ui/skeleton';
import { Loader2 } from 'lucide-react';

interface DisplayCommentsProps {
    postId: string;
    comments: any[];
    setComments: (comments: any[]) => void;
}

export default function DisplayComments(props: DisplayCommentsProps) {
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        if (!props.postId) return;
        fetch(`/api/posts/comments?post=${props.postId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                props.setComments(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });
    }, [props.postId])

    return (
        <div className='space-y-4 mt-6 mb-10'>
            {loading ? (
                <div className='flex w-full justify-center'>
                    <Loader2 className='mb-4 animate-spin' />
                </div>
            ) : (
                <>
                    {props.comments.length === 0 ? (
                        <p className='text-gray-500 text-center'>No comments yet</p>
                    ) : (
                        <>
                            {props.comments
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((comment) => (
                                <Comment comment={comment} key={comment?.id} />
                            ))}
                        </>
                    )}

                </>
            )}
        </div>
    )
}