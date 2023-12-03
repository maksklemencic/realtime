import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';

interface AvatarGroupProps {
    users: any[],
    max?: number,
    size?: number,
    iconSize?: number,
    spacing?: number,
    sessionUserId: string
}

export default function AvatarGroup(props: AvatarGroupProps) {
    const max = props.max || 3;
    const size = props.size || 8;
    const iconSize = props.iconSize || 4;
    const spacing = props.spacing || 24;


    function getWidth() {
        let amountOfUsers = props.users.filter((user: any) => user.id !== props.sessionUserId).length;
        if (amountOfUsers > max) {
            amountOfUsers = max;
        }
        
        return size*4*(amountOfUsers-(0.5*(amountOfUsers-1)));
    }

    return (
        <div className={`flex gap-1 w-[${getWidth()}px]`}>
            {props.users
                .sort((a, b) => (a.image ? -1 : 1) - (b.image ? -1 : 1))
                .filter((user: any) => user.id !== props.sessionUserId)
                .slice(0, max)
                .map((user, index) => (
                    <div className={`w-${size} h-${size}`} style={{ position: 'relative', left: `${index * -spacing}px`, zIndex: `${max - index}` }}>
                        <Avatar className={`w-${size} h-${size} rounded-full`} >
                            <AvatarImage src={user?.image} />
                            <AvatarFallback className={` h-${size} w-${size} rounded-lg bg-muted border`}><User className={`w-${iconSize} h-${iconSize}`} /></AvatarFallback>
                        </Avatar>
                    </div>     
                ))}
        </div>
    )

}