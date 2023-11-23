import { Loader2, Search, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useUserData } from '@/context/userData'
import { colors, formatDate } from '@/lib/consts'
import toast from 'react-hot-toast'

export default function DisplayGroups() {

    const { data: session } = useSession()
    const { groups } = useUserData()

    const { removeGroup } = useUserData()


    function handleDeleteGroup(groupId: string) {
        fetch('/api/groups/' + session?.user?.id + '?groupId=' + groupId, {
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
                removeGroup(groupId)
                toast.success('Group deleted')
            })
            .catch((err) => console.log(err));
    }

    function handleGroupLeave(group: any) {
        fetch('/api/groups/' + session?.user?.id + '/remove', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupId: group?.id,
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
                removeGroup(group?.id)
                toast.success('Left ' + group?.name)
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className=''>
            {!groups && (
                <Loader2 className='mx-auto h-24 animate-spin' size={24} />
            )}
            {groups && groups.length === 0 && (
                <div className='flex flex-col gap-4 justify-center items-center h-48 text-gray-500 text-md font-bold'>
                    You are not a member of any group ...
                    <Link href='/search?filter=groups&query='>
                        <Button className='h-8'>
                            Find groups
                            <Search className='h-4 w-4 ml-1' />
                        </Button>
                    </Link>
                </div>
            )}
            <div className='grid grid-cols-1 sm:grid-cols-2 mb-6'>
                {groups && groups.length > 0 && groups.map((group: any, i) => {
                    return (
                        <Card key={i} className='col-span-1 m-2'>
                            <CardContent className='p-4'>
                                <div className='flex justify-between'>
                                    {group?.image === null && (
                                        <div className={`h-16 w-16 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>

                                    )}
                                    {group?.image !== null && colors.includes(group.image) && (
                                        <div className={`h-16 w-16 rounded-lg ${group.image}`}></div>
                                    )}
                                    {group?.image !== null && !colors.includes(group.image) && (
                                        <img className='h-16 w-16 rounded-lg' src={group?.image} alt={group?.name} />
                                    )}

                                    <div className='flex flex-col justify-evenly items-end gap-1'>
                                        <p className='text-gray-400 text-sm'>{formatDate(group?.createdAt)}</p>
                                        <Badge className='h-6 w-fit'><Users className='h-4 w-4 mr-1' />{group?.userIds.length}</Badge>
                                    </div>

                                </div>
                                <p className='font-semibold mt-2 mx-1'>{group?.name}</p>
                                <div className='flex gap-1 w-full mt-4 justify-around'>
                                    <Link className='w-1/3' href={'/groups/' + group?.id + '?show=groupPosts'} >
                                        <Button className='h-8 w-full' variant='secondary'>View</Button>
                                    </Link>
                                    {session?.user?.id === group?.adminId ? (
                                        <Link className='w-1/3' href={'/groups/' + group?.id + '/edit'} >
                                            <Button disabled={session?.user?.id !== group?.adminId} className='h-8 w-full' variant='secondary'>Edit</Button>
                                        </Link>
                                    ) : (
                                        <Button disabled={session?.user?.id !== group?.adminId} className='w-1/3 h-8' variant='secondary'>Edit</Button>
                                    )}

                                    <div className='w-1/3 flex flex-col'>
                                        {session?.user?.id !== group?.adminId ? (
                                            <Button className='h-8 w-full' disabled={session?.user?.id === group?.adminId} variant='destructive' onClick={() => handleGroupLeave(group)}>Leave</Button>
                                        ) : (
                                            <Button className='h-8 w-full' disabled={session?.user?.id !== group?.adminId} variant='destructive' onClick={() => handleDeleteGroup(group?.id)}>Delete</Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
                )}
            </div>
        </div>
    )
}