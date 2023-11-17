"use client"
import React from 'react'
import ProfileCard from '@/components/users/profileCard'
import PostFeed from '@/components/posts/postFeed'
import TabSelector from '@/components/tabs'

export default function UsersUserIdPage({ params }: { params: { userId: string } }) {

  return (
    <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-4'>
      <ProfileCard userId={params.userId} />
      <TabSelector param='show' defaultTab='posts' tabs={['posts', 'liked', 'commented']} tabNames={['Posts', 'Liked', 'Commented']} />
      <PostFeed showUserId={params.userId} />
    </div >
  )
}