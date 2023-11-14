"use client"
import UsersList from '@/components/users/userList'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import React, { use, useEffect } from 'react'

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
    const [myFollowing, setMyFollowing] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`/api/users/${session?.user?.id}/following`)
            .then((res) => res.json())
            .then((data) => {
                setMyFollowing(data)
                let foll = data;
                
                fetch(`/api/users/${params.userId}/${show}`)
                        .then((res) => res.json())
                        .then((data) => {
                            setUsers(data.map((item: any) => {
                                return {
                                    id: item.id,
                                    name: item.name,
                                    email: item.email,
                                    image: item.image,
                                    isFollowing: foll.some((user: any) => user.id === item.id)
                                }
                            }))
                            setLoading(false)
                        })
                        .catch((err) => {
                            console.log(err)
                            setLoading(false)
                        })
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                return;
            })


    }, [show])


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <div className='h-10 rounded-lg border w-full flex justify-between mx-auto mb-4 bg-card'>
                <Link
                    href={{ query: { show: 'followers' } }}
                    className={`w-full flex justify-center items-center m-1 rounded ${show == 'followers' && 'bg-primary text-white'}`}
                >
                    <p className=' text-sm font-semibold'>Followers</p>
                </Link>
                <Link
                    href={{ query: { show: 'following' } }}
                    className={`w-full flex justify-center items-center m-1 rounded ${show == 'following' && 'bg-primary text-white'}`}
                >
                    <p className=' text-sm font-semibold'>Following</p>
                </Link>
            </div>

            <UsersList users={users} setUsers={setUsers} loading={loading} displayType={show === "followers" ? "followers" : "following"} displayUserId={params.userId}/>


        </div>
    )
}