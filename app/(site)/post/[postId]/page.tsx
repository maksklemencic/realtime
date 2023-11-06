"use client"
import React, { use, useEffect } from 'react'
import ProfileCard from '@/components/users/profileCard'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import PostFeed from '@/components/posts/postFeed'
import Post from '@/components/posts/post'

export default function PostPostIdPage({ params }: { params: { postId: string } }) {

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })

    const [post, setPost] = React.useState<any[]>([]);

    useEffect(() => {
        // fetch the post
        fetch(`/api/posts?id=${params.postId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setPost(data);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
            });
    }, [])

    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <Post post={post[0]} key={post[0]?.id}/>
        </div >
    )
}