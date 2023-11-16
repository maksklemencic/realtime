"use client"
import { Info, Loader2, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function DisplayGroups() {

    const { data: session, status } = useSession()

    const [groups, setGroups] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetch(`/api/groups/${session?.user?.id}`)
            .then(res => res.json())
            .then(data => {
                setGroups(data)
                setLoading(false)
            })
    }, [])

    function formatDate(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
    ]

    return (
        <div className=''>
            {loading && (
                <Loader2 className='mx-auto h-24 animate-spin' size={24} />
            )}
            {!loading && groups.length === 0 && (
                <div className='text-center  text-md font-bold'>
                    You are not in any groups
                </div>
            )}
            <div className='grid grid-cols-1 sm:grid-cols-2 mb-6'>
                {!loading && groups.length > 0 && groups.map((group: any, i) => {
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
                                    <Link className='w-1/3' href={'/groups/' + group?.id + '/edit'} >
                                        <Button className='h-8 w-full' variant='secondary'>Edit</Button>
                                    </Link>
                                    <Button className='h-8 w-1/3' variant='destructive'>Leave</Button>
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