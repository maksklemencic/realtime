"use client"
import React, { useEffect, useState } from 'react'
import Post from './post';
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation'

interface PostFeedProps {
    showUserId: string
    groupId?: string
}

export default function PostFeed(props: PostFeedProps) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams()
    const search = searchParams.get('show')
    const pathname = usePathname()

    const { data: session } = useSession()

    useEffect(() => {
        getPosts();
    }, [search]);

    function getPosts() {
        setLoading(true);
        const apiUrl = '/api/posts';

        let params = "";
        if (search === 'posts') {
            params = '?userId=' + props.showUserId;
        }
        else if (search === 'liked') {
            params = '/liked?author=' + props.showUserId;
        }
        else if (search === 'comments') {
            params = '/commented?author=' + props.showUserId;
        }
        else if (search === 'groupPosts') {
            params = '?groupId=' + props?.groupId;
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
        <div className=''>
            {!loading && posts.length > 0 &&
                posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post: any) => (
                        <div className='my-4'>
                            <Post key={post.id} post={post} unlikePost={removePostFromLkedPosts} />
                        </div>
                    ))}
            {!loading && posts.length == 0 && (
                <div className='w-full flex justify-center mt-16'>
                    {search === 'liked' && (
                        <p className='text-gray-500 text-center'>No liked posts yet</p>
                    )}
                    {search === 'posts' || search === 'groupPosts' && (
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