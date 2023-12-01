import React from 'react';

interface MessageProps {
    message: any;
    myMessage: boolean;
}

export default function Message(props: MessageProps) {
    const isMyMessage = props.myMessage;

    return (
        <div className={`w-full flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-full flex flex-col ${isMyMessage ? 'items-end' : 'itmes-start'}`}>
                <div className={` flex gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex flex-col gap-1 rounded-lg p-2  ${isMyMessage ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <p className=''>{props.message?.body}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
