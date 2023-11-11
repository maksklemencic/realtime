"use client"
import React, { use, useEffect } from 'react'
import ProfileCard from '@/components/users/profileCard'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import PostFeed from '@/components/posts/postFeed'
import ProfileEdit from '@/components/users/profileEdit'

export default function UsersUserIdPage({ params }: { params: { userId: string } }) {

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })

    useEffect(() => {
        if (session?.user?.id !== params.userId) {
            redirect('/users/' + params.userId)
        }

    }, [])

    return (
        <div className=''>
            <ProfileEdit />
        </div >
    )
}