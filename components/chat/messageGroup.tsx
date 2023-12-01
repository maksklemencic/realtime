import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Message from './message';
import { formatDateTimeChat } from '@/lib/consts';
import { User } from 'lucide-react';

interface MessageGroupProps {
    messageGroups: any[],
    myMessage: boolean
}

export default function MessageGroup(props: MessageGroupProps) {
    const isMyMessage = props.myMessage;
    return (
        <div className='w-full flex flex-col pr-3'>
            <p className='mx-auto text-gray-500 font-semibold text-xs mt-2'>{formatDateTimeChat(props.messageGroups[0]?.createdAt)}</p>
            <div className={`w-full my-1 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>

                <div className={` w-2/3 flex flex-col ${isMyMessage ? 'items-end' : 'itmes-start'}`}>
                    <p className={`text-sm text-gray-500 ${isMyMessage ? 'mr-10' : 'ml-10'}`}>{props.messageGroups[0]?.sender?.name}</p>
                    <div className={`flex justify-between items-end gap-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className='w-10'>
                            <Avatar className='w-8 h-8 rounded-full' >
                                <AvatarImage src={props.messageGroups[0]?.sender?.image} />
                                <AvatarFallback className=' h-8 w-8 rounded-lg bg-muted border'><User className='w-4 h-4'/></AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='w-full space-y-1 '>
                            {props.messageGroups.map((message, index) => (
                                <Message message={message} myMessage={isMyMessage} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
