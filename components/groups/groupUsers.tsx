import React from 'react'
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Dot, Minus, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useUserData } from '@/context/userData';
import { set } from 'zod';
import toast from 'react-hot-toast';

interface GroupUsersProps {
    group: any,
    setGroup: (group: any) => void,
    sessionUserId: string
}

export default function GroupUsers(props: GroupUsersProps) {

    const { groups, setGroups } = useUserData()

    function removeUserFromGroup(userId: string) {
        fetch(`/api/groups/${userId}/remove`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupId: props.group?.id
            })
        })
            .then(res => res.json())
            .then(data => {
                props.setGroup(data)
                setGroups(groups.map((group: any) => {
                    if (group.id === data.id) {
                        return data
                    }
                    return group
                }))
                toast.success(`User removed from group`)
            })
    }

    function displayAdminOnTop() {
        const admin = props.group?.users?.find((user: any) => user.id === props.group?.adminId)
        const users = props.group?.users?.filter((user: any) => user.id !== props.group?.adminId)
        if (users.length === 0) return [admin]
        return [admin, ...users]
    }

    return (
        <div>
            <Card className=''>
                <CardContent className='p-0'>
                    {displayAdminOnTop()?.map((user: any, index: any) => (
                        <div key={user?.id} className={`flex items-center justify-between p-2 ${index < props.group?.users?.length - 1 && ' border-b-2'}`}>
                            <div className='flex items-center gap-2'>
                                <Avatar className=" h-9 w-9 rounded-lg">
                                    <Link href={'http://localhost:3000/users/' + user?.id + '?show=posts'}>
                                        <AvatarImage src={user?.image} />
                                        <AvatarFallback className=' h-9 w-9 rounded-lg bg-background border'><User /></AvatarFallback>
                                    </Link>
                                </Avatar>
                                <div className='text-sm font-medium'>{user?.name}</div>
                                <Dot className='h-4 w-4 hidden sm:block' />
                                <div className='text-sm text-gray-400 hidden sm:block '>{user?.email}</div>
                            </div>
                            {props.group?.adminId && props.group?.adminId === user?.id && (
                                <Badge className='h-6 w-16' variant={"secondary"}><p className='text-sm'>Admin</p></Badge>

                            )}
                            {props.sessionUserId === props.group?.adminId && props.group?.adminId !== user.id && (
                                <Button size={'icon'} className='rounded-lg h-7 w-7' variant={'destructive'}>
                                    <Minus className='h-6 w-6' onClick={() => removeUserFromGroup(user?.id)}/>
                                </Button>
                            )}

                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
