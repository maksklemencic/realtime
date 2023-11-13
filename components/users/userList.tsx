"use client"
import { Loader2, User } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'

interface UsersListProps {
    users: any[]
    setUsers: (users: any[]) => void,
    displayType: "followers" | "following",
    displayUserId: string,
    loading?: boolean
}

export default function UsersList(props: UsersListProps) {
    const { data: session } = useSession()

    function handleFollow(userId: string) {
        fetch(`/api/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                followerId: session?.user?.id,
                followingId: userId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                props.setUsers(props.users.map((user: any) => {
                    if (user.id === userId) {
                        return {
                            ...user,
                            isFollowing: true
                        }
                    }
                    return user
                }))
            })
    }

    function handleUnfollow(userId: string) {
        fetch(`/api/follow?followerId=${session?.user?.id}&followingId=${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if ((props.displayType === "followers") || (props.displayType === "following" && session?.user?.id !== props.displayUserId)) {  
                    props.setUsers(props.users.map((user: any) => {
                        if (user.id === userId) {
                            return {
                                ...user,
                                isFollowing: false
                            }
                        }
                        return user
                    }))
                }
                else if (props.displayType === "following" && session?.user?.id === props.displayUserId) {
                    props.setUsers(props.users.filter((user: any) => user.id !== userId))
                } 
            })
    }

    return (
        <>
            {props.users && !props.loading && props.users.map((user: any) => (
                <Card key={user.id} className='mb-4'>
                    <CardContent className='flex items-center justify-between p-3'>

                        <Link href={'http://localhost:3000/users/' + user?.id + '?show=posts'}
                            className='flex justify-between w-full'>
                            <div className='mr-4'>
                                <Avatar className=" h-10 w-10 rounded-lg">
                                    <AvatarImage src={user?.image} />
                                    <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                                </Avatar>
                            </div>
                            <div className=' w-full '>
                                <div className='font-bold  text-sm'>{user?.name}</div>
                                <div className='text-gray-400 text-sm'>{user?.email}</div>
                            </div>

                        </Link>
                        {session?.user?.id !== user?.id && (
                            <>
                                {user.isFollowing ? (
                                    <Button className='h-8' variant={"destructive"} onClick={() => handleUnfollow(user?.id)}>Unfollow</Button>
                                ) : (
                                    <Button className='h-8' onClick={() => handleFollow(user?.id)}>Follow</Button>
                                )}
                            </>
                        )}
                        {session?.user?.id === user?.id && (
                            <Button className='h-8' variant={"outline"}>You</Button>
                        )}
                        
                    </CardContent>
                </Card>
            ))}
            {props.loading && (
                <div className='flex justify-center items-center mt-12'>
                    <Loader2 className='h-8 w-8 text-primary animate-spin' />
                </div>
            )}
        </>
    )
}