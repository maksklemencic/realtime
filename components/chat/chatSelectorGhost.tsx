import { Loader2, MessageCircle, PlusCircle } from 'lucide-react'
import React from 'react'
import { Separator } from '../ui/separator'

function ChatSelectorGhost() {
    return (
        <div className=' p-2'>
            <div className='flex justify-between items-center'>
                <p className='text-xl font-semibold'>Chat</p>
                <PlusCircle className='text-primary mr-2' />
            </div>
            <Separator className='my-2' />
            <div className='text-md font-semibold flex justify-between items-center bg-muted px-2 py-1 rounded'>
                <p>Conversations</p>
                <MessageCircle className='text-blue-500 fill-blue-500 h-5 w-5' />
            </div>
            <div className='my-8 space-y-2 flex justify-center'>
                <Loader2 className='animate-spin text-primary' />
            </div>
        </div>
    )
}

export default ChatSelectorGhost