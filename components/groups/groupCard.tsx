import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Users } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Badge } from '../ui/badge'


interface GroupCardProps {
    group: any
    setGroup: (group: any) => void
    key: string
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

export default function GroupCard(props: GroupCardProps) {

    function formatDate(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
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

                            <div className='flex flex-col justify-between items-end gap-1'>
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
                        <p className='font-semibold mt-2 mx-1'>{props?.group?.name}</p>
                        <div className='flex gap-2 w-full mt-4 justify-end'>

                            <Link className='w-fit' href={'/groups/' + props?.group?.id + '/edit'} >
                                <Button className='h-8 w-fit' variant='secondary'>Edit</Button>
                            </Link>
                            <Button className='h-8 w-fit' variant='destructive'>Leave</Button>
                        </div>


                    </CardContent>
                </Card>
            )}
        </>
    )
}