"use client"
import React, { useEffect, useState } from 'react'
import Post from './post';
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { set } from 'react-hook-form';


export default function PostFeed() {

    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);

    const searchParams = useSearchParams()
    const search = searchParams.get('show')

    useEffect(() => {
        const apiUrl = '/api/posts';
        console.log(apiUrl + '?author=' + session?.user?.id);
        if (search === 'posts') {
            fetch(apiUrl + '?author=' + session?.user?.id)
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
        }
        else if (search === 'likes') {
            setPosts([]);
        }
        else {
            setPosts([]);
        }
       
    }, [search]);


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4'>
            {posts.map((post: any) => (
                <Post key={post.id} post={post} myPosts={search==='posts'} />
            ))}
        </div>

    )
}