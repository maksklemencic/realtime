"use client"
import { Loader2, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'

export default function DisplayGroups() {

    const { data: session, status } = useSession()

    const [groups, setGroups] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch(`/api/groups/${session?.user?.id}`)
            .then(res => res.json())
            .then(data => {
                setGroups(data)
                setLoading(false)
            })
    }, [])

    return (
        <div className=''>
            {loading && (
                <Loader2 className='mx-auto h-24 animate-spin' size={24} />
            )}
            {!loading && groups.length === 0 && (
                <div className='text-center text-white text-2xl font-bold'>
                    You are not in any groups
                </div>
            )}
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3'>
                {!loading && groups.length > 0 && groups.map((group: any, i) => {
                    return (
                        <Card key={i} className='col-span-1 m-2'>
                            <CardContent className='p-2'>
                                <div className='flex justify-between'>
                                    <Avatar className=" h-10 w-10 rounded-lg">
                                        <AvatarImage src={group?.image} />
                                        <AvatarFallback className={`h-10 w-10 rounded-lg bg-blue-200 border text-gray-600`}><Users /></AvatarFallback>
                                    </Avatar>
                                    <Badge className='h-5'>{group?.userIds.length}</Badge>
                                </div>
                                <p className='font-semibold mt-2'>{group?.name}</p>

                            </CardContent>
                        </Card>
                    )
                }
                )}
            </div>
        </div>
    )
}