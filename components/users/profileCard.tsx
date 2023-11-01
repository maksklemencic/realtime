"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { set } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Edit, User } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'


type ProfileCardProps = {
    userId: string
}

function ProfileCard(props: ProfileCardProps) {

    const { data: session } = useSession();
    const [displayUser, setDisplayUser] = React.useState<any>(null);
    const isMyUser = props.userId === session?.user?.id;

    useEffect(() => {
        // fetch user data
        fetch(`/api/users/${props.userId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                console.log(data);
                setDisplayUser(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [])

    function formatDate(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    return (
        <Card className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 '>
            <CardContent className='px-0 '>
                {/* <p>{props.userId}</p> */}
                <div className='relative'>
                    <AspectRatio ratio={5 / 1} >
                        <Image
                            src="https://images.unsplash.com/photo-1517315003714-a071486bd9ea?auto=format&fit=crop&q=80&w=1171&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Photo by Drew Beamer"
                            className="rounded-t-md object-cover"
                            fill
                        />

                    </AspectRatio>
                    <div className='absolute left-6 -bottom-6'>
                        <Avatar className=" h-16 w-16 rounded-lg">
                            <AvatarImage src={displayUser?.image} />
                            <AvatarFallback className=' h-16 w-16 rounded-lg bg-background border'><User /></AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 px-6 py-2">
                    {/* Joined on {formatDate(displayUser?.createdAt)} */}
                    <Button className='h-8'>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit profile
                    </Button>
                </div>

                <div className=' px-6'>
                    <p className='font-semibold text-lg'>{displayUser?.name}</p>
                </div>
                <div className=' px-6'>
                    <p className='text-sm text-gray-500'>{displayUser?.email}</p>
                </div>
                <Card className='mx-6 my-2 bg-gray-50 dark:bg-muted overflow-auto'>
                    <CardContent className='py-2 max-h-32 '>
                        <p className='font-semibold'>Bio</p>
                        <p className='text-sm '>{displayUser?.bio} test bio </p>
                    </CardContent>
                </Card >

            </CardContent>
        </Card >
    )
}

export default ProfileCard