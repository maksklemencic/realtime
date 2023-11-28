import React from 'react'

interface MessageProps {
    message: any
}

export default function Message(props: MessageProps) {
    return (
        <div className='flex flex-col gap-2 border rounded-lg p-2'>
            <div className='flex gap-2'>
                <div className='w-8 h-8 bg-primary rounded-full'></div>
                <div className='flex flex-col gap-1'>
                    <p className='font-semibold'>{props.message?.sender?.name}</p>
                    <p className='text-sm text-gray-500'>{props.message?.createdAt}</p>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-sm text-gray-500'>{props.message?.body}</p>
            </div>
        </div>
    )
}