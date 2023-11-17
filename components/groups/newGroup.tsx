"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useSession } from 'next-auth/react'
import { Badge } from '../ui/badge'
import { PlusIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function NewGroup() {

    const { data: session } = useSession()
   
    const [groupMembers, setGroupMembers] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [queryText, setQueryText] = useState('')
    const [groupName, setGroupName] = useState('')

    const router = useRouter();

    useEffect(() => {
        fetch(`/api/users?query=${queryText}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data)
            })
    }, [queryText])

    function filterNotSelectedUsers(users: any[]) {
        return users.filter((user) => {
            return !groupMembers.some((member) => member.id === user.id) && user.id !== session?.user?.id
        })

    }

    function handleCreateGroup() {

        toast.promise(fetch(`/api/groups/${session?.user?.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: (groupName === '') ? `${session?.user?.name}'s group` : groupName,
                userIds: [...groupMembers.map((member) => member.id), session?.user?.id],

            })
        })
            .then(res => res.json())
            .then(data => {
                setGroupMembers([])
                return { success: true }
            }), {
            loading: 'Creating group...',
            success: (data: any) => {
                router.push(`/groups`)
                return `Group created`
            },
            error: 'Error creating group'
        })
    }

    return (
        <Card className='col-span-1'>
            <CardContent className='p-4'>
                <div className='flex justify-between '>
                    <div className='w-20 h-20 border-dashed border-2 border-primary rounded-lg bg-muted'>
                        image
                    </div>
                    <Button className='h-8' onClick={() => handleCreateGroup()}>Create</Button>
                </div>
                <Input className='mt-4' placeholder='Group name' onChange={(e: any) => setGroupName(e.target.value)} />
                <div className='my-4'>
                    <div className='flex justify-between my-2 mx-1 items-end'>
                        <p className='text-sm font-semibold'>Members</p>
                        <Button variant={"destructive"} className='h-8' onClick={() => setGroupMembers([])}>Remove all</Button>
                    </div>
                    <Card className='bg-background'>
                        <CardContent className='p-0 '>
                            <div key={session?.user?.id} className={`flex items-center justify-between p-2 border-b-2 border-dashed ${groupMembers.length == 0 && 'border-b-0'}`}>
                                <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                    <p className='text-sm col-span-1 overflow-hidden w-full'>{session?.user?.name}</p>
                                    <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{session?.user?.email}</p>
                                </div>
                                <Badge className='h-6 w-16' variant={"secondary"}><p className='text-sm'>Admin</p></Badge>
                            </div>
                            {groupMembers?.map((member, i) => {
                                return (
                                    <div key={member.id} className={`flex items-center justify-between p-2 ${i < groupMembers.length - 1 && 'border-b'} `}>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                            <p className='text-sm col-span-1 overflow-hidden w-full'>{member.name}</p>
                                            <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{member.email}</p>
                                        </div>
                                        <div className='flex w-16 ml-2 justify-end'>
                                            <Button
                                                size={"icon"}
                                                variant={"destructive"}
                                                className='h-6 w-fit'
                                                onClick={() => setGroupMembers((prev) => prev.filter((user) => user.id !== member.id))}
                                            >
                                                <X />
                                            </Button>
                                        </div>

                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                    <Card className=' bg-background mt-4'>
                        <CardContent className='p-2 text-sm'>
                            <div>
                                <p className='font-semibold'>Add members</p>
                                <Input className='mt-2' placeholder='Search for users' onChange={(e: any) => setQueryText(e.target.value)} />
                            </div>
                            <div className='flex flex-col gap-2 mt-4'>
                                {filterNotSelectedUsers(users)?.map((user, i) => {
                                    return (
                                        <div key={user.id} className={`flex items-center justify-between p-2 ${i < filterNotSelectedUsers(users).length - 1 && 'border-b'}`}>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                                <p className='text-sm col-span-1 overflow-hidden w-full'>{user.name}</p>
                                                <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{user.email}</p>
                                            </div>
                                            <div className='flex w-16 ml-2 justify-end'>
                                                <Button
                                                    size={"icon"}
                                                    variant={"secondary"}
                                                    className='h-6 w-6 rounded-md bg-green-500 hover:bg-green-600'
                                                    onClick={() => setGroupMembers((prev) => [...prev, user])}
                                                >
                                                    <PlusIcon className=' w-5 h-5' />
                                                </Button>
                                            </div>

                                        </div>
                                    )
                                })}
                                {filterNotSelectedUsers(users).length === 0 && (
                                    <div className='text-center text-gray-400 mb-4 mt-2'>
                                        No users found
                                    </div>

                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}