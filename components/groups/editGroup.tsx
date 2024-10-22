"use client";
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { colors, formatDate } from '@/lib/consts'
import { Badge } from '../ui/badge'
import { FileImage, FileX, Loader2, PlusIcon, User, Users, X } from 'lucide-react'
import { Input } from '../ui/input'
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/context/userData';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { uploadPicture } from '@/lib/imagekitApis';

interface EditGroupProps {
    group: any
}

export default function EditGroup(props: EditGroupProps) {

    const router = useRouter()
    const [groupName, setGroupName] = useState(props?.group?.name)
    const [groupMembers, setGroupMembers] = useState<any[]>(props?.group?.users)
    const [queryText, setQueryText] = useState('')
    const [users, setUsers] = useState<any[]>([])
    const [newAdmin, setNewAdmin] = useState<any>(null)

    const [file, setFile] = React.useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { updateGroup } = useUserData()
    const { data: session } = useSession()

    function filterNotSelectedUsers(users: any[]) {
        return users.filter((user) => {
            return !groupMembers?.some((member) => member.id === user.id) && user.id !== session?.user?.id
        })
    }

    async function handleUpdateGroup() {


        let url = props.group?.image;
        if (file) {
            const response = await uploadPicture('/groups/' + props.group?.id, file!);
        
            const content = await response.json();
            if (!response?.ok) {
                setFile(null);
                toast.error('Error uploading the image.');
                return;
            }
            url = content.url;
        }

        let newMemebers = groupMembers.map((member) => member.id)
        if (!newMemebers.includes(session?.user?.id)) {
            newMemebers.push(session?.user?.id)
        }
        fetch(`/api/groups/${session?.user?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: groupName,
                groupId: props?.group?.id,
                userIds: newMemebers,
                adminId: (newAdmin) ? newAdmin?.id : props?.group?.adminId,
                image: url
            })
        })
            .then(res => res.json())
            .then(data => {
                updateGroup(props?.group?.id, data)
                router.push('/groups/' + props?.group?.id + '?show=groupPosts')
                toast.success('Group updated')
            })
    }

    useEffect(() => {
        setGroupMembers(props?.group?.users?.filter((user: any) => user.id !== props?.group?.adminId))
    }, [props.group?.users])

    useEffect(() => {
        fetch(`/api/users?query=${queryText}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data)
            })
    }, [queryText])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            {!props?.group?.id && (
                <div className='w-full h-32 flex justify-center items-center'>
                    <Loader2 className='animate-spin w-8 h-8' />
                </div>
            )}
            {props?.group?.id && (
                <Card className='col-span-1'>
                    <CardContent className='p-4'>
                        <div className='flex justify-start gap-4 '>
                            {file ? (
                                <>
                                    <img className='sm:h-20 sm:w-20 h-16 w-16 rounded-lg' src={URL.createObjectURL(file)} alt={props?.group?.name} />
                                </>
                            ) : (
                                <>
                                    {props?.group?.image === null && (
                                        <div className={`sm:h-20 sm:w-20 h-16 w-16 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>

                                    )}
                                    {props?.group?.image !== null && colors.includes(props?.group?.image) && (
                                        <div className={`sm:h-20 sm:w-20 h-16 w-16 rounded-lg ${props?.group?.image}`}></div>
                                    )}
                                    {props?.group?.image !== null && !colors.includes(props?.group?.image) && (
                                        <img className='sm:h-20 sm:w-20 h-16 w-16 rounded-lg' src={props?.group?.image} alt={props?.group?.name} />
                                    )}
                                </>
                            )}

                            <div className="relative">
                                <div className={`flex h-20 justify-between ${file ? 'flex-col' : 'flex-col-reverse'}`}>

                                    {file && (
                                        <Badge className='w-fit h-8 border border-gray-300 dark:border-gray-600' variant="secondary">
                                            {file.name}
                                        </Badge>
                                    )}
                                    <div className='flex gap-4'>
                                        <Button onClick={handleButtonClick} variant={"outline"} className='h-8 flex gap-2 w-fit'>
                                            <FileImage className='h-4 w-4' />
                                            {file ? 'Change' : 'Upload'}
                                        </Button>
                                        {file && (
                                            <Button variant={"destructive"} className='h-8 flex gap-2 w-fit' onClick={() => setFile(null)}>
                                                <FileX className='h-4 w-4' />
                                                Remove
                                            </Button>
                                        )}

                                    </div>

                                </div>

                                <Input
                                    ref={fileInputRef}
                                    type='file'
                                    className='hidden'
                                    onChange={handleFileChange}
                                />

                            </div>

                        </div>
                        <div>
                            <div className='flex justify-end items-center w-full gap-4 my-2'>
                                <div className='flex flex-row gap-2 items-end'>
                                    <p className='font-semibold text-sm'>Created:</p>
                                    <p className='text-gray-400 text-sm'>{formatDate(props?.group?.createdAt)}</p>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                    <p className='font-semibold text-sm'>Members:</p>
                                    <Badge className='h-6 w-fit'><Users className='h-4 w-4 mr-1' />{props?.group?.userIds?.length}</Badge>
                                </div>

                            </div>
                        </div>
                        <div>
                            <Label className='mt-4 ml-1'>Group name</Label>
                            <Input className='w-full mt-2' value={groupName} defaultValue={props?.group?.name} onChange={(e: any) => setGroupName(e.target.value)} />
                        </div>

                        <div className='my-4 mx-1'>
                            <p className='text-sm font-semibold mb-2'>Transfer admin rights to</p>
                            <div className='flex gap-4 items-center'>
                                <Select onValueChange={(e) => setNewAdmin(groupMembers?.find((user) => user?.id === e))}>
                                    <SelectTrigger className="w-full md:w-1/2">
                                        <SelectValue placeholder="Select a new admin">
                                            {newAdmin ? (
                                                <div className='flex gap-4 items-center'>
                                                    <Avatar className=" h-6 w-6 rounded-lg">
                                                        <AvatarImage src={newAdmin?.image} />
                                                        <AvatarFallback className=' h-6 w-6 rounded-lg bg-background border'><User /></AvatarFallback>
                                                    </Avatar>
                                                    <p className='text-sm overflow-hidden font-semibold'>{newAdmin?.name}</p>
                                                </div>
                                            ) : (
                                                <p>Select a new admin</p>
                                            )}
                                        </SelectValue>

                                    </SelectTrigger>
                                    <SelectContent className='w-fit'>
                                        <SelectGroup className='w-full'>
                                            {groupMembers?.map((member, i) => (
                                                <SelectItem key={member.id} value={member.id} className='hover:cursor-pointer w-full'>
                                                    <div className='flex justify-between items-center w-full gap-4'>
                                                        <div>
                                                            <Avatar className=" h-8 w-8 rounded-lg">
                                                                <AvatarImage src={member?.image} />
                                                                <AvatarFallback className=' h-8 w-8 rounded-lg bg-background border'><User /></AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <p className='text-sm overflow-hidden font-semibold'>{member.name}</p>
                                                            <p className='text-sm overflow-hidden hidden sm:flex'>{member.email}</p>
                                                        </div>

                                                    </div>
                                                </SelectItem>
                                            )
                                            )}
                                            {groupMembers?.length === 0 && (
                                                <div className='text-center text-gray-400 my-3'>
                                                    No members found
                                                </div>

                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {newAdmin && (
                                    <Button
                                        size={"icon"}
                                        variant={"destructive"}
                                        className='h-8 w-8'
                                        onClick={() => setNewAdmin(null)}
                                    >
                                        <X />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className='my-4'>
                            <div className='flex justify-between my-2 mx-1 items-end'>
                                <p className='text-sm font-semibold'>Members</p>
                                <Button variant={"destructive"} className='h-8' onClick={() => setGroupMembers([])}>Remove all</Button>
                            </div>
                            <Card className='bg-background'>
                                <CardContent className='p-0 '>
                                    <div key={session?.user?.id} className={`flex items-center justify-between p-2 border-b-2 border-dashed ${groupMembers?.length === 0 && 'border-b-0 border-none'}`}>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                            <p className='text-sm col-span-1 overflow-hidden w-full'>{session?.user?.name}</p>
                                            <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{session?.user?.email}</p>
                                        </div>
                                        <Badge className='h-6 w-16' variant={"secondary"}><p className='text-sm'>Admin</p></Badge>
                                    </div>
                                    {groupMembers?.map((member, i) => {
                                        return (
                                            <div key={member.id} className={`flex items-center justify-between p-2 ${i < (groupMembers?.length - 1) ? 'border-b' : 'border-b-0'} `}>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                                    <p className='text-sm col-span-1 overflow-hidden w-full'>{member.name}</p>
                                                    <p className='text-sm col-span-1 overflow-hidden w-full hidden sm:block'>{member.email}</p>
                                                </div>
                                                <div className='flex w-16 ml-2 justify-end'>
                                                    <Button
                                                        size={"icon"}
                                                        variant={"destructive"}
                                                        className='h-6 w-fit'
                                                        onClick={() => {
                                                            setGroupMembers((prev) => prev.filter((user) => user.id !== member.id));
                                                            if (newAdmin?.id === member.id) {
                                                                setNewAdmin(null)
                                                            }
                                                        }}
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
                                                <div key={user.id} className={`flex items-center justify-between p-2 ${i < ((filterNotSelectedUsers(users)).length - 1) && 'border-b'}`}>
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
                                                            <PlusIcon className=' w-5 h-5 text-white' />
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
                        <div className='flex gap-4 items-center justify-end'>

                            <Link href={'/groups/' + props?.group?.id + '?show=groupPosts'} >
                                <Button className='h-8 w-fit' variant='destructive'>Cancel</Button>
                            </Link>
                            <Button className='h-8 w-fit' onClick={() => handleUpdateGroup()}>Save</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
