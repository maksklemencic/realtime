"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Textarea } from '../ui/textarea'
import useAutosizeTextArea from '@/hooks/useAutoSizeTextArea';
import { ScrollArea } from '../ui/scroll-area';
import { AtSign, Image, LocateFixedIcon, Smile } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { set } from 'react-hook-form';

export default function NewPost() {

    const [textContent, setTextContent] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, textContent);

    const router = useRouter()

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })

    const specialButtons = [
        {
            icon: <Image />,
            color: "bg-green-400",
        },
        {
            icon: <LocateFixedIcon />,
            color: "bg-blue-400",
        },
        {
            icon: <Smile />,
            color: "bg-orange-400",
        },
        {
            icon: <AtSign />,
            color: "bg-red-400",
        }
    ]

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setTextContent(val);
    };

    function createNewPost() {
        // call api
        
        toast.promise(
            fetch(`/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: textContent,
                    author: session?.user?.id
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        throw new Error('Content and Author are required')
                    }
                    else if (response.status === 500) {
                        throw new Error('Something went wrong')
                    }
                    else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    throw error;
                }),
            {
                loading: 'Posting ...',
                success: () => {
                    setTextContent("");
                    router.push('/home');
                    return 'New post created!'
                },
                error: (err) => {
                    setTextContent("");
                    return err.message
                },
            }
        );
    }

    return (
        <Card>
            <CardContent className='p-2'>
                <textarea
                    id="review-text"
                    onChange={handleChange}
                    placeholder="What would you like to share?"
                    ref={textAreaRef}
                    rows={1}
                    value={textContent}
                    className="resize-none outline-none border-none w-full p-2 bg-transparent"
                />
                <Separator className='mb-2' />
                <div className='flex justify-between p-2'>
                    <div className='flex gap-2 h-8'>
                        {specialButtons.map((button, index) => (
                            <button key={index} className={`${button.color} rounded-md px-2 py-1 text-white`}>
                                {button.icon}
                            </button>
                        ))}
                    </div>
                    <div className='flex justify-end'>
                        <Button className='h-8' onClick={() => createNewPost()}>Post</Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}