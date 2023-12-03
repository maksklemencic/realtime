"use client"
import React, { use, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronLeft, CopyX, Loader2, PlusCircle, User } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import MessageGroup from './messageGroup'
import { Separator } from '../ui/separator'
import { AvatarGroup } from '@nextui-org/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatWindowProps {
    conversationId: string,
    conversationName: string,
    updateConversation: (conversationId: string, newConversation: any) => void,
    conversations: any[],
    isSmallScreen: boolean
    setShowChatSelector: (showChatSelector: boolean) => void
}

export default function ChatWindow(props: ChatWindowProps) {

    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const [newMessage, setNewMessage] = useState('')

    const { data: session } = useSession()

    let currConversation = props.conversations?.find((conversation: any) => conversation.id === props.conversationId);

    useEffect(() => {

        if (!props.conversationId) return;
        currConversation = props.conversations?.find((conversation: any) => conversation.id === props.conversationId);

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
                props.updateConversation(props.conversationId, data);
                setMessages([...messages, data]);
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    }


    function getMessageGroups(messages: any[]) {
        const groups: any[] = [];
        messages.forEach(message => {
            if (groups.length === 0) {
                groups.push([message]);
                return groups;
            }
            let currentSender = groups[groups.length - 1][0]?.sender?.id;
            let firstMessageTime = groups[groups.length - 1][0]?.createdAt;
            let timeDiff = Math.abs((new Date(message.createdAt)).getDate() - (new Date(firstMessageTime)).getDate());
            if (currentSender === message.sender?.id && timeDiff < 1) {
                groups[groups.length - 1].push(message);
            }
            else {
                groups.push([message]);
            }
        });

        return groups;
    }

    return (
        <div className='w-full h-full p-2'>
            <div className='flex justify-between items-center h-8 '>
                <div className='flex items-center gap-4'>
                    {props.isSmallScreen && (
                        <div className='p-1 pr-2 flex gap-2 rounded hover:bg-muted hover:cursor-pointer' onClick={() => props.setShowChatSelector(true)}>
                             <ChevronLeft className='text-primary' />
                            <p className='font-semibold'>Back</p>
                        </div>

                    )}
                    {currConversation && !props.isSmallScreen && (
                        <AvatarGroup max={6} size='sm' >
                            {currConversation.users.filter((user: any) => user.id !== session?.user.id).map((user: any) => (
                                <Avatar key={user.id} className={`w-8 h-8 rounded-full`} >
                                    <AvatarImage src={user?.image} />
                                    <AvatarFallback className={` h-11 w-11 rounded-full bg-muted border`}><User className={`w-5 h-5`} /></AvatarFallback>
                                </Avatar>
                            ))
                            }
                        </AvatarGroup>
                    )}
                </div>
                <p className='text-xl font-semibold'>{props.conversationName}</p >

                <div className='flex gap-2'>
                    <div className='p-1 px-2 flex gap-2 rounded hover:bg-muted hover:cursor-pointer'>
                        <p className='font-semibold'>Add</p>
                        <PlusCircle className='text-primary' />
                    </div>
                    {/* <Separator orientation='vertical' className='h-8' />
                    <div className='p-1 flex gap-2 rounded hover:bg-muted hover:cursor-pointer'>
                    <p className='font-semibold'>Leave</p>
                        <CopyX className='text-destructive' />
                    </div> */}
                </div>
            </div >
            <Separator className='my-2' />
            {loading ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <Loader2 className='h-10 w-10 text-primary animate-spin' />
                </div>
            ) : (
                <div className='w-full h-[calc(100%-54px)] flex flex-col justify-between gap-3'>
                    <ScrollArea className='w-full flex flex-col gap-3'>
                        {messages?.length > 0 && (
                            <>
                                {getMessageGroups(messages)?.map(group => (
                                    <MessageGroup messageGroups={group} myMessage={session?.user?.id === group[0]?.sender?.id} />
                                ))}
                            </>
                        )}
                        {/* {(props.conversations && !loading && messages?.length === 0) && (
                            <p className=''>
                                No messages yet. Send a message to start a conversation.
                            </p>
                        )} */}
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
