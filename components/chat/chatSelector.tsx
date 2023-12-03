import React from 'react'
import { Separator } from '../ui/separator'
import { Dot, ListPlus, MessageCircle, Pin, PinOff } from 'lucide-react'
import ChatSelectorGhost from './chatSelectorGhost';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { formatTime } from '@/lib/consts';
import { Input } from '../ui/input';
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import NewChat from './newChat';

interface ChatSelectorProps {
    conversations: any,
    setConversations: (conversation: any) => void,
    loading: boolean,
    selectedConversationId: string,
    sessionUserId: string,
    showChatSelector: boolean,
    setShowChatSelector: (showChatSelector: boolean) => void
}

export default function ChatSelector(props: ChatSelectorProps) {
    const size = 8;

    function handlePinClick(conversationId: string) {
        const isPinned = props.conversations?.find((conversation: any) => conversation.id === conversationId).isPinnedUserIds.includes(props.sessionUserId);
        let pinUsers = props.conversations?.find((conversation: any) => conversation.id === conversationId).isPinnedUserIds;
        if (pinUsers.includes(props.sessionUserId)) {
            pinUsers = pinUsers.filter((userId: string) => userId !== props.sessionUserId);
        } else {
            pinUsers.push(props.sessionUserId);
        }
        fetch(`/api/conversations`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: conversationId,
                    isPinned: pinUsers
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                props.setConversations(props.conversations?.map((conversation: any) => {
                    if (conversation.id === conversationId) {
                        conversation.isPinnedUserIds = pinUsers;
                    }
                    return conversation;
                }));
            })
            .catch((error) => {
                console.error('Error updating conversation:', error);
            });

    }



    return (
        <>
            {props.loading ? (
                <ChatSelectorGhost />
            ) : (
                <div className=' p-2  h-full'>
                    <div className='flex justify-between items-center h-8'>
                        <p className='text-xl font-semibold'>Chat</p >
                        <Dialog>
                            <DialogTrigger className=''>
                                <div className='p-1 flex gap-2 rounded hover:bg-muted hover:cursor-pointer'>
                                    <p className='font-semibold'>New</p>
                                    <ListPlus className='text-primary' />
                                </div>
                            </DialogTrigger>
                            <NewChat conversations={props.conversations} setConversations={props.setConversations} />
                        </Dialog>

                    </div >
                    <Separator className='my-2' />
                    <div>
                        <Input placeholder='Search' className='w-full mb-3 mt-2' />
                    </div>

                    <div>
                        {props.conversations?.find((conversation: any) => conversation.id === conversation.id && conversation.isPinnedUserIds.includes(props.sessionUserId)) && (
                            <>
                                <div className='text-md font-semibold flex justify-between items-center bg-yellow-200 text-black px-2 py-1 rounded-lg border'>
                                    <p>Pinned</p>
                                    <Pin className=' h-5 w-5' />
                                </div>
                                <div className='my-2 space-y-2'>
                                    {props.conversations?.filter((conversation: any) => conversation.isPinnedUserIds.includes(props.sessionUserId))
                                        .map((conversation: any) => {
                                            return (
                                                Conversation(conversation)
                                            )
                                        })}
                                </div>
                            </>
                        )}

                        <div className='text-md text-white font-semibold flex justify-between items-center bg-blue-500 px-2 py-1 rounded-lg border'>
                            <p>Conversations</p>
                            <MessageCircle className=' h-5 w-5 ' />
                        </div>
                        {props.conversations?.find((conversation: any) => conversation.id === conversation.id && !conversation.isPinnedUserIds.includes(props.sessionUserId)) ? (
                            <div className='my-2 space-y-2'>

                                {props.conversations?.filter((conversation: any) => !conversation.isPinnedUserIds.includes(props.sessionUserId))
                                    .map((conversation: any) => {
                                        return (
                                            Conversation(conversation)
                                        )
                                    })}
                            </div>
                        ) : (
                            <p className='w-full p-2 flex justify-center text-sm text-gray-400'>No conversations</p>
                        )}

                    </div>
                </div >
            )
            }

        </>
    )

    function Conversation(conversation: any) {

        return (
            <Link href={'/chat?conversationId=' + conversation.id}>
                <Card className='mb-2'>

                    <CardContent className={`flex gap-2 justify-between p-2 rounded-lg hover:cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800
                        ${(props.selectedConversationId === conversation.id) && 'bg-blue-500 text-white hover:bg-blue-500 dark:hover:bg-blue-500 '}
                    `}>
                        <div className='w-full h-full flex flex-col gap-0'>
                            <div className='w-full flex justify-between items-start gap-1'>
                                {/* <p className='overflow-hidden text-md font-semibold whitespace-nowrap overflow-ellipsis max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[40%]'> */}
                                <p>
                                    {conversation.name}
                                </p>
                                {conversation.isPinnedUserIds.includes(props.sessionUserId) ? (
                                    <PinOff className='h-5 w-5 hover:text-destructive hover:fill-destructive ' onClick={() => handlePinClick(conversation?.id)}></PinOff>
                                ) : (
                                    <Pin className='h-5 w-5 hover:text-gray-500 hover:fill-yellow-300 ' onClick={() => handlePinClick(conversation?.id)}></Pin>
                                )}
                            </div>

                            <div className={`w-full text-sm font-medium flex justify-start items-start 
                                ${(props.selectedConversationId === conversation.id) ? 'text-background dark:text-foreground ' : 'text-gray-500 dark:text-gray-300 '}
                            `}>
                                {conversation?.messages?.length > 0 && (
                                                                    <p className={`w-9 block sm:hidden lg:block `}>
                                    {conversation?.messages?.length > 0 ? (formatTime(conversation.messages[conversation.messages.length - 1].createdAt)) : ''}
                                </p>
                                )}
                                {conversation?.messages?.length > 0 && (
                                    <Dot className='w-6  block sm:hidden lg:block'>...</Dot>
                                )}
                                {/* <p className='overflow-hidden text-gray-400 whitespace-nowrap overflow-ellipsis '> */}
                                <p className={` `}>
                                    {conversation?.messages?.length > 0 ? conversation.messages[conversation.messages.length - 1].body : 'No messages yet ...'}
                                </p>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            </Link>
        );

    }
}