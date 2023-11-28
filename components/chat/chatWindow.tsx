"use client"
import React, { use, useEffect, useState } from 'react'
import Message from './message'
import { useSession } from 'next-auth/react'
import { set } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

interface ChatWindowProps {
    conversationId: string
}

export default function ChatWindow(props: ChatWindowProps) {

    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const { data: session } = useSession()

    useEffect(() => {
        if (!props.conversationId) return;
        setLoading(true)
        fetch(`/api/messages/${session?.user?.id}?conversationId=${props.conversationId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setMessages(data[0].messages);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching conversations:', error);
            });

    }, [props.conversationId])

    return (
        <div className='w-full h-full border rounded-lg p-2'>
            {props.conversationId}
            {loading ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <Loader2 className='h-10 w-10 text-primary animate-spin' />
                </div>
            ) : (
                <div className='w-full h-full flex flex-col gap-3'>
                    {messages?.length > 0 ? (
                        <>
                            {messages?.map((message) => (
                                <Message message={message} />
                            ))}
                        </>
                    ) : (
                        <div className='flex w-full h-full justify-center items-center'>
                            <p>
                                No messages yet. Send a message to start a conversation.
                            </p>
                        </div>
                    )}


                </div>
            )}

            {/* // <Message message={{}} /> */}
        </div>
    )
}
