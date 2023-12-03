"use client"
import React, { use, useEffect, useState } from 'react'
import { DialogContent, DialogFooter, DialogHeader } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { AlertCircle, PlusIcon, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ScrollArea } from '../ui/scroll-area'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DialogClose } from '@/components/ui/dialog';


interface NewChatProps {
    conversations: any,
    setConversations: (conversation: any) => void,
}

export default function NewChat(props: NewChatProps) {
    const [users, setUsers] = useState<any[]>([])
    const [queryText, setQueryText] = useState('')
    const [chatMembers, setChatMembers] = useState<any[]>([])

    const [chatName, setChatName] = useState('')

    const { data: session } = useSession()

    useEffect(() => {
        fetch(`/api/users?query=${queryText}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data)
            })

        console.log("users", users)
        console.log("chatMembers", chatMembers)

    }, [queryText])


    function filterNotSelectedUsers(users: any[]) {
        return users.filter((user) => {
            return !chatMembers.some((member) => member.id === user.id) && user.id !== session?.user?.id
        })

    }

    function createChat() {

        const userIds = chatMembers.map((user) => user.id)
        userIds.push(session?.user?.id)

        let name = chatName;
        if (name === '') {
            if (chatMembers.length <= 3) {
                name = chatMembers.map((user) => user.name).join(', ');
            } else {
                name = chatMembers.slice(0, 3).map((user) => user.name).join(', ') + '...';
            }
        }

        console.log("userIds", userIds)
        console.log("name", name)

        fetch(`/api/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userIds: userIds,
                name: name
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log("data", data)
                props.setConversations([...props.conversations, data]);
                console.log("props.conversations", props.conversations, data)
                // closeDialog();
            })
            .catch((error) => {
                console.error('Error creating conversation:', error);
            });
    }

    return (
        <div>
            <DialogContent>
                <p className='text-lg font-semibold'>New chat</p>
                <div>
                    <Label className='' htmlFor='chatname'>Chat name</Label>
                    <Input placeholder='Chat name' id='chatname' className='w-full mt-2' value={chatName} onChange={(e: any) => setChatName(e.target.value)} />
                </div>
                {chatMembers.length === 0 && (
                    <Alert variant="destructive" className='p-2'>
                        <AlertDescription className='flex items-center gap-2 justify-center'>
                        <AlertCircle className="h-4 w-4" />
                            Select at least one user
                        </AlertDescription>
                    </Alert>
                )}
                <div>
                    <Label>Members</Label>
                    <Card className='bg-background'>
                        <CardContent className={`p-0 max-h-60 h-[${chatMembers?.length * 10}px] overflow-scroll`}>
                            <ScrollArea className='h-full'>
                                <div key={session?.user?.id} className={`flex items-center justify-between p-2 border-b-2 border-dashed bg-muted ${chatMembers.length == 0 && 'border-b-0 border-none'}`}>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                        <p className='text-sm col-span-1 overflow-hidden w-full'>{session?.user?.name}</p>
                                        <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{session?.user?.email}</p>
                                    </div>
                                </div>
                                {chatMembers?.map((member, i) => {
                                    return (
                                        <div key={member.id} className={`flex items-center justify-between p-2 ${i < chatMembers.length - 1 && 'border-b'} `}>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                                <p className='text-sm col-span-1 overflow-hidden w-full'>{member.name}</p>
                                                <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{member.email}</p>
                                            </div>
                                            <div className='flex w-16 ml-2 justify-end'>
                                                <Button
                                                    size={"icon"}
                                                    variant={"destructive"}
                                                    className='h-6 w-fit'
                                                    onClick={() => setChatMembers((prev) => prev.filter((user) => user.id !== member.id))}
                                                >
                                                    <X />
                                                </Button>
                                            </div>

                                        </div>
                                    )
                                })}
                            </ScrollArea>
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
                                                    onClick={() => setChatMembers((prev) => [...prev, user])}
                                                >
                                                    <PlusIcon className=' w-5 h-5 text-white' />
                                                </Button>
                                            </div>

                                        </div>
                                    )
                                })}
                                {filterNotSelectedUsers(users)?.length === 0 && (
                                    <div className='text-center text-gray-400 mb-4 mt-2'>
                                        No users found
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <div>
                        <DialogFooter className='mt-4'>
                            <DialogClose className='mr-2'>
                            <Button onClick={() => createChat()} disabled={chatMembers.length === 0} type='submit'>Create chat</Button>
                            </DialogClose>
                            
                        </DialogFooter>
                    </div>
                </div>

            </DialogContent>
            
        </div>

    )
}