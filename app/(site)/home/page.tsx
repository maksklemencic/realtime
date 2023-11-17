"use client"
import { useSession } from "next-auth/react"
import PostFeed from "@/components/posts/postFeed"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { use, useEffect, useState } from "react"
import Link from "next/link"
import { redirect, useParams, useSearchParams } from "next/navigation"

export default function HomePage() {
  const { data: session } = useSession()

  const [selectedFilter, setSelectedFilter] = useState("")

  useEffect(() => {
    if (selectedFilter) {
      setSelectedFilter('all')
    }
  }, []);

  return (
    <div className="mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-6">
      <div className="mt-2 flex justify-end">
        <Select  onValueChange={(e: string) => setSelectedFilter(e)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Filter posts" />
          </SelectTrigger>
          <SelectContent className=''>
            <SelectGroup>
                <SelectItem className='hover:cursor-pointer' value="all">All posts</SelectItem>
                <SelectItem className='hover:cursor-pointer' value="following">Following</SelectItem>
                <SelectItem className='hover:cursor-pointer' value="groups">Groups</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <PostFeed showUserId={session?.user.id} filterHomeFeed={selectedFilter}/>
    </div>
  )
}
