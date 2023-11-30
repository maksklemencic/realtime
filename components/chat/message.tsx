import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface MessageProps {
    message: any;
    myMessage: boolean;
}

export default function Message(props: MessageProps) {
    const isMyMessage = props.myMessage;

    const containerStyle = `flex flex-col gap-2 border rounded-lg p-2 ${isMyMessage ? 'self-end bg-primary' : 'bg-background'
        }`;

    const messageContainerStyle = `flex flex-col gap-1 ${isMyMessage ? 'items-end' : 'items-start'
        }`;

    return (

        <div className={`w-full my-1 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-1/2 flex flex-col ${isMyMessage ? 'items-end' : 'itmes-start'}`}>
                <p className='text-sm text-gray-500'>{props.message?.sender?.name}</p>
                <div className={` flex gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className='w-8 h-8 rounded-full' >
                        <AvatarImage src={props.message?.sender?.image} />
                        <AvatarFallback >
                            {props.message?.sender?.name}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col gap-1 rounded-lg p-2 ${isMyMessage ? 'bg-primary' : 'bg-muted'}`}>
                        <p className=''>{props.message?.body}</p>
                    </div>
                </div>
            </div>
        </div>
    )


    //     <div className={containerStyle} style={{ maxWidth: '50%' }}>
    //       <div className='flex gap-2'>
    //         <div
    //           className={`w-8 h-8 rounded-full ${
    //             isMyMessage ? 'bg-primary' : 'bg-background'
    //           }`}
    //         ></div>
    //         <div className={messageContainerStyle}>
    //           <p className='font-semibold'>{props.message?.sender?.name}</p>
    //           <p className='text-sm text-gray-500'>{props.message?.createdAt}</p>
    //         </div>
    //       </div>
    //       <div className={messageContainerStyle}>
    //         <p className='text-sm text-gray-500'>{props.message?.body}</p>
    //       </div>
    //     </div>
    //   );
}
