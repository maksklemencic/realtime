"use client"
import React, { use, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ChatSelector from '@/components/chat/chatSelector'

export default function ChatPage() {

    const { data: session } = useSession()

    const [conversations, setConversations] = useState(null)
    const [loading, setLoading] = useState(false)
    

    useEffect(() => {
        setLoading(true)
        fetch(`/api/conversations?userId=${session?.user?.id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setConversations(data);
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error fetching conversations:', error);
        });
        
    }, [])


    return (
        <div className='w-full py-6 px-4 md:px-8 xl:px-16 2xl:px-32 '>
            <div className='flex w-full justify-between gap-4'>
                <div className='w-full h-full sm:w-2/5 lg:w-1/3'>
                    <ChatSelector conversations={conversations} setConversations={setConversations} loading={loading}/>
                </div>
                <div className='hidden sm:flex sm:w-3/5 lg:w-2/3'>
                    2
                </div>
            </div>

        </div >
    )
}