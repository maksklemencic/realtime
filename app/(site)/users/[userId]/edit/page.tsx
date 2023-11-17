"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import ProfileEdit from '@/components/users/profileEdit'

export default function UsersUserIdPage({ params }: { params: { userId: string } }) {

    const { data: session, status } = useSession();

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