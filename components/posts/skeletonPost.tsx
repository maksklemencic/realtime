import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Skeleton } from '../ui/skeleton'

export default function SkeletonPost() {
    return (
        <Card>
            <CardContent className='p-4 pb-2'>
                <div className='flex justify-between'>
                    <div className='mr-4'>
                        <Skeleton className=' h-10 w-10 rounded-lg bg-background border' />
                    </div>
                    <div className=' w-full'>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-4 w-48 mt-1' />
                        <Skeleton className='h-4 w-full mt-4' />
                        <Skeleton className='h-4 w-full mt-2' />
                    </div>
                </div>
                <Separator className='my-2 mt-4' />
                <div className='flex w-full justify-center'>
                    <div className='flex justify-evenly gap-4 w-4/5'>
                        <Skeleton className='h-4 w-20' />
                        <div className='flex gap-2 items-center '>
                            <Skeleton className='h-4 w-4' />
                        </div>
                        <div className={`flex gap-2 items-center text-red-500`}>
                            <Skeleton className='h-4 w-4' />
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card >
    )
}

