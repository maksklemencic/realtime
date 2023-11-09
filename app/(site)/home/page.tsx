"use client"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { redirect } from "next/navigation"
import Link from "next/link"
import Post from "@/components/posts/post"
import PostFeed from "@/components/posts/postFeed"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })

  return (
    <div >
      <PostFeed showUserId={session?.user.id}/>
      
    </div>
  )
}
