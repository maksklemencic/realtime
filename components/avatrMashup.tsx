import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';

interface AvatarMashupProps {
    users: any[],
    max?: number,
    size?: number,
    iconSize?: number,
    spacing?: number,
    sessionUserId: string
}

export default function AvatarMashup(props: AvatarMashupProps) {
    const max = props.max || 3;
    const size = props.size || 8;
    const iconSize = props.iconSize || 4;
    const spacing = props.spacing || 24;

    let avatarComponents = props.users
        .sort((a, b) => (a.image ? -1 : 1) - (b.image ? -1 : 1))
        .filter((user: any) => user.id !== props.sessionUserId)
        .slice(0, max)
        .map((user, index) => {
            let avatarStyle: React.CSSProperties = {};
            if (max === 1) {
                // Display single avatar normally
                avatarStyle = {};
            } else if (max === 2) {
                // Display first avatar bigger in top left, second avatar smaller in bottom right
                if (index === 0) {
                    avatarStyle = {
                        width: `${size + 4}px`,
                        height: `${size + 4}px`,
                        position: 'absolute',
                        top: '0',
                        left: '0',
                    };
                } else if (index === 1) {
                    avatarStyle = {
                        width: `${size}px`,
                        height: `${size}px`,
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                    };
                }
            } else if (max === 3) {
                // Display first avatar in top left, second avatar in bottom center, third avatar in top right
                if (index === 0) {
                    avatarStyle = {
                        width: `${size}px`,
                        height: `${size}px`,
                        position: 'absolute',
                        top: '0',
                        left: '0',
                    };
                } else if (index === 1) {
                    avatarStyle = {
                        width: `${size}px`,
                        height: `${size}px`,
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    };
                } else if (index === 2) {
                    avatarStyle = {
                        width: `${size}px`,
                        height: `${size}px`,
                        position: 'absolute',
                        top: '0',
                        right: '0',
                    };
                }
            }

            return (
                <Avatar
                    key={user.id}
                    className={`w-${size} h-${size} rounded-full`}
                >
                    <AvatarImage src={user?.image} />
                    <AvatarFallback
                        className={`h-${size} w-${size} rounded-lg bg-muted border`}
                    >
                        <User className={`w-${iconSize} h-${iconSize}`} />
                    </AvatarFallback>
                </Avatar>
            );
        }
        );
    return (
        <div className={`flex gap-1`}>
            {avatarComponents}
        </div>
    )
}