"use client"
import React, { use, useEffect, useState } from 'react'
import Message from './message'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

interface ChatWindowProps {
    conversationId: string
}

export default function ChatWindow(props: ChatWindowProps) {

    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const [newMessage, setNewMessage] = useState('')

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

    function sendMessage(message: string) {
        fetch(`/api/messages/${session?.user?.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: message,
                conversationId: props.conversationId,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setNewMessage('');
                setMessages([...messages, data]);
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    }

    return (
        <div className='w-full h-full border rounded-lg p-2'>
            {loading ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <Loader2 className='h-10 w-10 text-primary animate-spin' />
                </div>
            ) : (
                <div className='w-full h-full flex flex-col justify-between gap-3'>
                    <ScrollArea className='w-full flex flex-col gap-3'>
                        {messages?.length > 0 ? (
                            <>
                                {messages?.map((message) => (
                                    <Message message={message} myMessage={session?.user?.id === message?.sender?.id}/>
                                ))}
                            </>
                        ) : (
                            <div className='flex w-full h-full justify-center items-center'>
                                <p>
                                    No messages yet. Send a message to start a conversation.
                                </p>
                            </div>
                        )}


                    </ScrollArea>
                    <div className='flex gap-2'>
                        <Input value={newMessage} onChange={(e: any) => setNewMessage(e.target.value)} />
                        <Button onClick={() => sendMessage(newMessage)}>Send</Button>
                    </div>
                </div>
            )}

        </div>
    )
}
