import React from 'react'
import { Separator } from '../ui/separator'
import { Dot, MessageCircle, Pin, PinOff, PlusCircle } from 'lucide-react'

interface ChatSelectorProps {
    conversations: any
}

export default function ChatSelector(props: ChatSelectorProps) {
    return (
        <div>
            <div className=' p-2'>
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-semibold'>Chat</p>
                    <PlusCircle className='text-primary mr-2' />
                </div>
                <Separator className='my-2' />
                <div>
                    <div className='text-md font-semibold flex justify-between items-center'>
                        <p>Pinned</p>
                        <Pin className='dark:text-yellow-200 dark:fill-yellow-200 text-yellow-500 fill-yellow-500 h-5 w-5 mr-2' />
                    </div>
                    <div className='my-2 space-y-2'>
                        {props.conversations?.filter((conversation: any) => conversation.isPinned === true)
                            .map((conversation: any) => {
                                return (
                                    Conversation(conversation)
                                )
                            })}
                    </div>
                    <div className='border border-dashed my-2' />
                    <div className='text-md font-semibold flex justify-between items-center'>
                        <p>Conversations</p>
                        <MessageCircle className='text-blue-500 fill-blue-500 h-5 w-5 mr-2' />
                    </div>
                    <div className='my-2 space-y-2'>
                        {props.conversations?.filter((conversation: any) => conversation.isPinned === false)
                            .map((conversation: any) => {
                                return (
                                    Conversation(conversation)
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )

    function Conversation(conversation: any) {
        return (
            <div className='w-full flex gap-2 justify-between p-2 rounded-lg hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 '>
                <div className=''>
                    <div className='bg-blue-200 h-10 w-10 rounded-full'></div>
                </div>

                <div className='w-full h-full flex flex-col gap-0'>
                    <div className='w-full flex justify-between items-start gap-1'>
                        {/* <p className='overflow-hidden text-md font-semibold whitespace-nowrap overflow-ellipsis max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[40%]'> */}
                        <p>
                            {conversation.name} nionsa soanois a
                        </p>
                        <Pin className='h-5 w-5 hover:text-yellow-300 hover:fill-yellow-300'></Pin>
                    </div>

                    <div className='w-full text-sm font-medium flex justify-start items-start'>
                        <p className='w-9 text-gray-500 block sm:hidden lg:block'>18:32</p>
                        <Dot className='w-6 text-gray-500 block sm:hidden lg:block'>...</Dot>
                        {/* <p className='overflow-hidden text-gray-400 whitespace-nowrap overflow-ellipsis '> */}
                        <p className='text-gray-400'>
                            Last message text here...
                        </p>
                    </div>
                </div>
            </div>
        );

    }
}