"use client"
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import ChatSelector from '@/components/chat/chatSelector'

export default function ChatPage() {

    const { data: session } = useSession()



    return (
        <div className='py-6 px-6 md:px-8 xl:px-16 2xl:px-32 '>
            <div className='flex justify-between gap-4'>
                <div className='w-full h-full sm:w-[400px]'>
                    <ChatSelector />
                </div>
                <div className='hidden sm:block sm:w-full'>
                    2
                </div>
            </div>

        </div >
    )
}