"use client"
import React, { useEffect } from 'react'
import Post from '@/components/posts/post'
import NewComment from '@/components/comments/newComment'
import DisplayComments from '@/components/comments/displayComments'
import { Separator } from '@/components/ui/separator'

export default function PostPostIdPage({ params }: { params: { postId: string } }) {

    const [post, setPost] = React.useState<any[]>([]);
    const [comments, setComments] = React.useState<any[]>([]);

    useEffect(() => {
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


    function addComment(comment: any) {
        setComments([...comments, comment]);
    }

    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <Post post={post[0]} key={post[0]?.id} comments={comments} />
            <NewComment postId={post[0]?.id} addComment={addComment}/>
            <Separator className='mt-6'/>
            <DisplayComments postId={post[0]?.id} comments={comments} setComments={setComments}/>
        </div >
    )
}