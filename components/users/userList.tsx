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
    loading?: boolean
}

export default function UsersList(props: UsersListProps) {
    const { data: session } = useSession()
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
                            <Button className='h-8'>Follow</Button>
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