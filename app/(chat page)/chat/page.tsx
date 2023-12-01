"use client"
import React, { use, useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ChatSelector from '@/components/chat/chatSelector'
import ChatWindow from '@/components/chat/chatWindow'
import { useSearchParams } from 'next/navigation'


export default function ChatPage() {

    const { data: session } = useSession()

    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const conversationId = searchParams.get('conversationId')

    useEffect(() => {

        if (!searchParams.get('conversationId') && conversations?.length > 0) {
            const params = new URLSearchParams(searchParams)
            params.set('conversationId', conversations?.[0]?.id)

            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
        }
    }, [conversations])

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

    function updateConversation(conversationId: string, message: any) {
        // add message to conversation with the id
        setConversations(conversations?.map((conversation: any) => {
            if (conversation.id === conversationId) {
                conversation.messages.push(message);
            }
            return conversation;
        }));
    }


    return (
        <div className='w-full h-full py-6 px-4 md:px-8 xl:px-16 2xl:px-32 '>
            <div className='flex w-full h-full justify-between gap-4'>
                <div className='w-full h-full sm:w-2/5 lg:w-1/3'>
                    <ChatSelector conversations={conversations} setConversations={setConversations} loading={loading} selectedConversationId={conversationId || ""} sessionUserId={session?.user?.id} />
                </div>
                <div className='hidden sm:flex sm:w-3/5 lg:w-2/3 h-full'>
                    <ChatWindow conversationId={conversationId || ""} conversationName={conversations.find(conversation => conversation.id === conversationId)?.name}
                    updateConversation={updateConversation}/>
                </div>
            </div>

        </div >
    )
}