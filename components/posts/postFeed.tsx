"use client"
import React, { useEffect, useState } from 'react'
import Post from './post';
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { set } from 'react-hook-form';
import SkeletonPost from './skeletonPost';
import { Loader2 } from 'lucide-react';

interface PostFeedProps {
    showUserId: string
}

export default function PostFeed(props: PostFeedProps) {

    const [posts, setPosts] = useState([]);

    const searchParams = useSearchParams()
    const search = searchParams.get('show')

    const { data: session } = useSession()

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setLoading(true);
        const apiUrl = '/api/posts';

        let params = "";
        if (search === 'posts') {
            params = '?author=' + props.showUserId;
        }
        else if (search === 'liked') {
            params = '/liked?author=' + props.showUserId;
        }

        fetch(apiUrl + params)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);

            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, [search]);


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-6'>
            {!loading && posts.map((post: any) => (
                <Post key={post.id} post={post} />
            ))}
            {loading && (
                // <div className='space-y-4'>
                //     <SkeletonPost />
                //     <SkeletonPost />
                // </div>
                <div className='w-full flex justify-center mt-16'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            )}
        </div>

    )
}