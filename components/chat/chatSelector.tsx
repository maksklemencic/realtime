import React from 'react'
import { Separator } from '../ui/separator'
import { Dot, ListPlus, MessageCircle, Pin, PinOff, PlusCircle } from 'lucide-react'
import ChatSelectorGhost from './chatSelectorGhost';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';

interface ChatSelectorProps {
    conversations: any,
    setConversations: (conversation: any) => void,
    loading: boolean,
    selectedConversationId: string
}

export default function ChatSelector(props: ChatSelectorProps) {

    function handlePinClick(conversationId: string) {
        const isPinned = props.conversations?.find((conversation: any) => conversation.id === conversationId).isPinned;
        fetch(`/api/conversations`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: conversationId,
                    isPinned: !isPinned
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
                        conversation.isPinned = !isPinned;
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
                        <div className='p-1 flex gap-2 rounded hover:bg-muted hover:cursor-pointer'>
                            <p className='font-semibold'>New</p>
                            <ListPlus className='text-primary' />
                        </div>
                    </div >
                    <Separator className='my-2' />
                    <div>
                        {props.conversations?.find((conversation: any) => conversation.id === conversation.id && conversation.isPinned == true) && (
                            <>
                                <div className='text-md font-semibold flex justify-between items-center bg-muted px-2 py-1 rounded-lg border'>
                                    <p>Pinned</p>
                                    <Pin className='dark:text-yellow-200 dark:fill-yellow-200 text-yellow-500 fill-yellow-500 h-5 w-5' />
                                </div>
                                <div className='my-2 space-y-2'>
                                    {props.conversations?.filter((conversation: any) => conversation.isPinned === true)
                                        .map((conversation: any) => {
                                            return (
                                                Conversation(conversation)
                                            )
                                        })}
                                </div>
                            </>
                        )}

                        {/* <div className='border border-dashed my-2' /> */}
                        <div className='text-md font-semibold flex justify-between items-center bg-muted px-2 py-1 rounded-lg border'>
                            <p>Conversations</p>
                            <MessageCircle className='text-blue-500 fill-blue-500 h-5 w-5' />
                        </div>
                        {props.conversations?.find((conversation: any) => conversation.id === conversation.id && conversation.isPinned == false) ? (
                            <div className='my-2 space-y-2'>

                                {props.conversations?.filter((conversation: any) => conversation.isPinned === false)
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
                    {/* className={`w-full flex gap-2 justify-between p-2 rounded-lg hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800
                ${!(!conversation.isPinned || (props.selectedConversationId === conversation.id)) && 'bg-yellow-200 dark:bg-gray-900 '} 
                ${(props.selectedConversationId === conversation.id) ? 'bg-blue-500 text-background dark:text-foreground hover:bg-blue-700 ' :
                        ''} */}
                    <CardContent className={`flex gap-2 justify-between p-2 rounded-lg hover:cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-800
                        ${(props.selectedConversationId === conversation.id) && 'bg-primary  '}
                    `}>
                        <div className=''>
                            <div className='bg-blue-200 h-10 w-10 rounded-full'></div>
                        </div>

                        <div className='w-full h-full flex flex-col gap-0'>
                            <div className='w-full flex justify-between items-start gap-1'>
                                {/* <p className='overflow-hidden text-md font-semibold whitespace-nowrap overflow-ellipsis max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[40%]'> */}
                                <p>
                                    {conversation.name}
                                </p>
                                {conversation?.isPinned ? (
                                    <PinOff className='h-5 w-5 hover:text-destructive hover:fill-destructive ' onClick={() => handlePinClick(conversation?.id)}></PinOff>
                                ) : (
                                    <Pin className='h-5 w-5 hover:text-yellow-300 hover:fill-yellow-300 ' onClick={() => handlePinClick(conversation?.id)}></Pin>
                                )}
                            </div>

                            <div className={`w-full text-sm font-medium flex justify-start items-start 
                                ${(props.selectedConversationId === conversation.id) ? 'text-background dark:text-foreground ' : 'text-gray-500 dark:text-gray-300 '}
                            `}>
                                <p className={`w-9 block sm:hidden lg:block `}>
                                    18:32
                                </p>
                                <Dot className='w-6  block sm:hidden lg:block'>...</Dot>
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