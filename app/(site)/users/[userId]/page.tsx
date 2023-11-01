import React from 'react'
import BreadCrumb from '@/components/breadcrumb'
import ProfileCard from '@/components/users/profileCard'

export default function UsersUserIdPage({ params }: { params: { userId: string } }) {

    return (
        <div className=' space-y-4'>
            <ProfileCard userId={params.userId} />
        </div >
    )
}