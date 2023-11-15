"use client"
import React from 'react'
import ProfileCard from '@/components/users/profileCard'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import PostFeed from '@/components/posts/postFeed'

export default function UsersUserIdPage({ params }: { params: { userId: string } }) {

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })  

  return (
    <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-4'>
      <ProfileCard userId={params.userId} />
      <PostFeed showUserId={params.userId} />
    </div >
  )
}