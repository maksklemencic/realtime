"use client"
import UsersList from '@/components/users/userList'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function UserFriendsPage({ params }: { params: { userId: string } }) {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })

    const searchParams = useSearchParams();
    const show = searchParams.get('show');

    const [users, setUsers] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`/api/users/${params.userId}/${show}`)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })

    }, [show])


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <div className='h-10 rounded-lg border w-full md:w-3/4 flex justify-between mx-auto mb-4'>
                <Link
                    href={{ query: { show: 'followers' } }}
                    className={`w-full flex justify-center items-center m-1 rounded ${show == 'followers' && 'bg-primary'}`}
                >
                    <p className=' text-sm font-semibold'>Followers</p>
                </Link>
                <Link
                    href={{ query: { show: 'following' } }}
                    className={`w-full flex justify-center items-center m-1 rounded ${show == 'following' && 'bg-primary'}`}
                >
                    <p className=' text-sm font-semibold'>Following</p>
                </Link>
            </div>

            <UsersList users={users} loading={loading}/>


        </div>
    )
}