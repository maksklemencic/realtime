import React from 'react'
import { Card, CardContent } from '../ui/card'
import { MailPlus, User, Users } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { formatDate, colors } from '@/lib/consts'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/context/userData'
import toast from 'react-hot-toast'

interface GroupCardProps {
    group: any
    setGroup: (group: any) => void
    key: string
    sessionUserId: string
}

export default function GroupCard(props: GroupCardProps) {

    const router = useRouter()
    const { removeGroup, addNewGroup } = useUserData()

    function getAdmin() {
        return props?.group?.users?.find((user: { id: any }) => user.id === props?.group?.adminId)
    }

    function handleDeleteGroup() {
        fetch('/api/groups/' + props?.sessionUserId + '?groupId=' + props.group?.id, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    // Check if the response has content before trying to parse it as JSON
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return res.json();
                    } else {
                        // If the response is not JSON, return an empty object or whatever is appropriate
                        return {};
                    }
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                removeGroup(props.group?.id)
                props.setGroup(data);
                router.push('/groups');
                toast.success('Group deleted')
            })
            .catch((err) => console.log(err));
    }

    function handleGroupJoin() {
        fetch('/api/groups/' + props?.sessionUserId + '/add', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupId: props?.group?.id,
            })
        })
            .then((res) => {
                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return res.json();
                    } else {
                        return {};
                    }
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                addNewGroup(data)
                props.setGroup(data);
                toast.success('Joined ' + props.group?.name)
            })
            .catch((err) => console.log(err));
    }

    function handleGroupLeave() {
        fetch('/api/groups/' + props?.sessionUserId + '/remove', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupId: props?.group?.id,
            })
        })
            .then((res) => {
                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return res.json();
                    } else {
                        return {};
                    }
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                removeGroup(props.group?.id)
                props.setGroup(data);
                toast.success('Left ' + props.group?.name)
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            {props?.group && (
                <Card className='col-span-1'>
                    <CardContent className='p-4'>
                        <div className='flex justify-between '>
                            {props?.group?.image === null && (
                                <div className={`sm:h-24 sm:w-24 h-16 w-16 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>

                            )}
                            {props?.group?.image !== null && colors.includes(props?.group?.image) && (
                                <div className={`sm:h-24 sm:w-24 h-16 w-16 rounded-lg ${props?.group?.image}`}></div>
                            )}
                            {props?.group?.image !== null && !colors.includes(props?.group?.image) && (
                                <div className={`sm:h-24 sm:w-24 h-16 w-16 rounded-lg bg-background border`}>
                                    <img className='object-cover w-full h-full rounded-lg' src={props?.group?.image} alt='Group image' />
                                </div>
                            
                            )}
                            <div className='flex flex-col justify-start items-end gap-3'>
                                <div className='flex flex-row gap-2 items-end'>
                                    <p className='font-semibold text-sm'>Created:</p>
                                    <p className='text-gray-400 text-sm'>{formatDate(props?.group?.createdAt)}</p>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                    <p className='font-semibold text-sm'>Members:</p>
                                    <Badge className='h-6 w-fit'><Users className='h-4 w-4 mr-1' />{props?.group?.userIds?.length}</Badge>
                                </div>
                                {getAdmin() && (
                                    <div className='flex gap-4 items-center'>
                                        <p className='font-semibold text-sm'>Admin:</p>
                                        <div className='flex gap-2 items-center'>
                                            <Avatar className=" h-8 w-8 rounded-lg">
                                                <AvatarImage src={getAdmin()?.image} />
                                                <AvatarFallback className=' h-8 w-8 rounded-lg bg-background border'><User className='h-5 w-5' /></AvatarFallback>
                                            </Avatar>
                                            <p>{getAdmin()?.name}</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        <p className='font-semibold mt-2 mx-1'>{props?.group?.name}</p>
                        <div className='flex gap-2 w-full mt-4 justify-end items-end'>
                            <div>
                                <Link href={'/home/new?to=' + props?.group?.id}>
                                    <Button className='h-8 flex items-center gap-2'>
                                        <MailPlus className='w-4 h-4' />
                                        New post
                                    </Button>
                                </ Link>
                            </div>
                            <div className='flex gap-2 w-full mt-4 justify-end'>
                                {props?.group?.adminId === props?.sessionUserId && (
                                    <Link className='w-fit' href={'/groups/' + props?.group?.id + '/edit'} >
                                        <Button className='h-8 w-fit' variant='secondary'>Edit</Button>
                                    </Link>
                                )}
                                {props.group?.users?.find((user: any) => user.id == props?.sessionUserId) ? (
                                    <>
                                        {(props?.group?.adminId === props?.sessionUserId) ? (
                                            <Button className='h-8 w-fit' variant='destructive' onClick={() => handleDeleteGroup()}>Delete</Button>
                                        ) : (
                                            <Button className='h-8 w-fit' variant='destructive' onClick={() => handleGroupLeave()}>Leave</Button>
                                        )}
                                    </>
                                ) : (
                                    <Button className='h-8 w-fit' onClick={() => handleGroupJoin()}>Join</Button>
                                )}
                            </div>

                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}