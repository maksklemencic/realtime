"use client"

import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { set } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import Image from "next/image"


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

    return (
        <Card className='mx-6 md:mx-12 xl:mx-24 2xl:mx-48 w-full h-80 '>
            <CardContent className='px-0 '>
                {/* <p>{props.userId}</p> */}
                <AspectRatio ratio={5 / 1}>
                    <Image
                        src="https://images.unsplash.com/photo-1533282960533-51328aa49826?auto=format&fit=crop&q=80&w=2142&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Photo by Drew Beamer"
                        className="rounded-t-md object-cover"
                        fill
                    />
                </AspectRatio>
            </CardContent>
        </Card>
    )
}

export default ProfileCard