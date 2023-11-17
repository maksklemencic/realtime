"use client"
import { useSession } from "next-auth/react"
import PostFeed from "@/components/posts/postFeed"

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-6">
      <PostFeed showUserId={session?.user.id}/>
    </div>
  )
}
