"use client"
import React, { useEffect, useState } from 'react'
import Post from './post';
import { useSearchParams } from 'next/navigation'

interface PostFeedProps {
    showUserId: string
}

export default function PostFeed(props: PostFeedProps) {

    const [posts, setPosts] = useState([]);

    const searchParams = useSearchParams()
    const search = searchParams.get('show')

    useEffect(() => {
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

            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });


    }, [search]);


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4'>
            {posts.map((post: any) => (
                <Post key={post.id} post={post}/>
            ))}
        </div>

    )
}