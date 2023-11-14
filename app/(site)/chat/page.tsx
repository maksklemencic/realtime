"use client"
import React from 'react'
import ProfileCard from '@/components/users/profileCard'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import PostFeed from '@/components/posts/postFeed'

export default function ChatPage() {

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })  

  return (
    <div className=' space-y-4 mb-4 bg-yellow-200'>
      Chat
    </div >
  )
}