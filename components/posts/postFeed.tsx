"use client"
import React, { useEffect, useState } from 'react'
import Post from './post';
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button';

interface PostFeedProps {
    showUserId: string
}

export default function PostFeed(props: PostFeedProps) {

    const [posts, setPosts] = useState([]);

    const searchParams = useSearchParams()
    const search = searchParams.get('show')
    const pathname = usePathname()


    const { data: session } = useSession()

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        getPosts();
    }, [search]);

    function getPosts() {
        setLoading(true);
        const apiUrl = '/api/posts';

        let params = "";
        if (search === 'posts') {
            params = '?author=' + props.showUserId;
        }
        else if (search === 'liked') {
            params = '/liked?author=' + props.showUserId;
        }
        else if (search === 'comments') {
            params = '/commented?author=' + props.showUserId;
        }
        
        if (pathname === '/home') {
            params = '/' + session?.user?.id;
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
    }

    function removePostFromLkedPosts(postId: string) {
        setPosts(posts.filter((post: any) => post.id !== postId))
    }


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-6'>
            {!loading && posts.length > 0 && posts.map((post: any) => (
                <Post key={post.id} post={post} unlikePost={removePostFromLkedPosts} />
            ))}
            {!loading && posts.length == 0 && (
                <div className='w-full flex justify-center mt-16'>
                    {search === 'liked' && (
                        <p className='text-gray-500 text-center'>No liked posts yet</p>
                    )}
                    {search === 'posts' && (
                        <p className='text-gray-500 text-center'>No posts yet</p>
                    )}
                    {search === 'comments' && (
                        <p className='text-gray-500 text-center'>No comments yet</p>
                    )}
                </div>

            )}
            {loading && (
                <div className='w-full flex justify-center mt-16'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            )}
        </div>

    )
}