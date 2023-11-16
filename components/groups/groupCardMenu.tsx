import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function GroupCardMenu() {

    const searchParams = useSearchParams();
    const show = searchParams.get('show');
    
    return (
        <div>
            <div className='h-10 rounded-lg border w-full flex justify-between mx-auto mb-4 bg-card'>
                <Link
                    href={{ query: { show: 'groupPosts' } }}
                    className={`w-full flex justify-center items-center m-1 rounded ${show == 'groupPosts' && 'bg-primary text-white'}`}
                >
                    <p className=' text-sm font-semibold'>Posts</p>
                </Link>
                <Link
                    href={{ query: { show: 'members' } }}
                    className={`w-full flex justify-center items-center m-1 rounded ${show == 'members' && 'bg-primary text-white'}`}
                >
                    <p className=' text-sm font-semibold'>Members</p>
                </Link>
            </div>
        </div>
    )
}