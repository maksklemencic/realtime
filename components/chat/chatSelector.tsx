import React from 'react'
import { Separator } from '../ui/separator'
import { Pin, PlusCircle } from 'lucide-react'

export default function ChatSelector() {
    return (
        <div>
            <div className=' p-2'>
                <div className='flex justify-between items-center'>
                    <p className='text-lg font-semibold'>Chat</p>
                    <PlusCircle className='text-primary' />
                </div>
                <Separator className='my-2' />
                <div>
                    <div className='flex justify-between items-center'>
                        <p>Pinned</p>
                        <Pin className='dark:text-yellow-200 dark:fill-yellow-200 text-yellow-500 fill-yellow-500 h-5 w-5'/>
                    </div>
                    <div>
                        *Pinned conversations*
                    </div>
                    <div className='border border-dashed my-2'/>
                    <div>
                        *Normal conversations*
                    </div>
                </div>
            </div>
        </div>
    )
}