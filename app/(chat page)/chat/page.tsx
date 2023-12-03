"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import { useMediaQuery } from '@/hooks/useMediaQuery'; // Adjust the path accordingly

import ChatSelector from '@/components/chat/chatSelector'
import ChatWindow from '@/components/chat/chatWindow'


export default function ChatPage() {
    const { data: session } = useSession()
    const [conversations, setConversations] = useState<any[]>([])
    const [showChatSelector, setShowChatSelector] = useState(true)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const conversationId = searchParams.get('conversationId')
    const [selectedConversationId, setSelectedConversationId] = useState("")

    useEffect(() => {
        if (!searchParams.get('conversationId') && conversations?.length > 0) {
            const params = new URLSearchParams(searchParams)
            params.set('conversationId', conversations?.[0]?.id)
            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
        }
        setSelectedConversationId(searchParams.get('conversationId') || conversations?.[0]?.id)
        setShowChatSelector(false)

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

    useEffect(() => {
        if (!conversationId) return;
        setShowChatSelector(false)
        setSelectedConversationId(conversationId)
    }, [conversationId])

    function updateConversation(conversationId: string, message: any) {
        setConversations(conversations?.map((conversation: any) => {
            if (conversation.id === conversationId) {
                conversation.messages.push(message);
            }
            return conversation;
        }));
    }

    // Use media query to check for screen size
    const isSmallScreen = useMediaQuery('(max-width: 640px)');

    return (

        <div className='w-full h-full py-2 px-4 md:px-8 xl:px-16 2xl:px-32 '>
            {/* <p className='text-white'>isSmallScreen: {isSmallScreen ? 'true' : "false"}</p>
            <p className='text-white'>showChatSelector: {showChatSelector ? 'true' : "false"}</p> */}
            <div className='flex w-full h-full justify-between gap-4'>
                <div className='w-full h-full sm:w-2/5 lg:w-1/3'>

                    {(showChatSelector || !isSmallScreen) ? (
                        <ChatSelector
                            conversations={conversations}
                            setConversations={setConversations}
                            loading={loading}
                            selectedConversationId={selectedConversationId || ""}
                            sessionUserId={session?.user?.id}
                            showChatSelector={showChatSelector}
                            setShowChatSelector={setShowChatSelector}
                        />
                    ) : (
                        <ChatWindow
                            conversationId={selectedConversationId || ""}
                            conversationName={conversations.find(conversation => conversation.id === selectedConversationId)?.name}
                            updateConversation={updateConversation}
                            conversations={conversations}
                            isSmallScreen={isSmallScreen}
                            setShowChatSelector={setShowChatSelector}
                        />
                    )}

                </div>
                <div className='hidden sm:flex sm:w-3/5 lg:w-2/3 h-full'>
                    <ChatWindow
                        conversationId={selectedConversationId || ""}
                        conversationName={conversations.find(conversation => conversation.id === selectedConversationId)?.name}
                        updateConversation={updateConversation}
                        conversations={conversations}
                        isSmallScreen={false}
                        setShowChatSelector={setShowChatSelector}
                    />
                </div>
            </div>

        </div >
    )
}
