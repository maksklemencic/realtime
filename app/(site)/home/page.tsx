"use client"
import { useSession } from "next-auth/react"
import PostFeed from "@/components/posts/postFeed"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import FilterCard from "@/components/filter"

export default function HomePage() {
  const { data: session } = useSession()

  const [selectedFilters, setSelectedFilters] = useState<any[]>([])

  const searchParams = useSearchParams()!
  const filter = searchParams.get('filter')

  useEffect(() => {
    if (filter) {
      
      if (filter === 'all') {
        setSelectedFilters(['GROUPS', 'FOLLOWING'])
      }
      else {
        setSelectedFilters(filter.split('-').map((item) => item.toUpperCase()))
      }
    }
  }, [filter])  

  return (
    <div className="mx-6 md:mx-16 xl:mx-32 2xl:mx-56 space-y-4 mb-6">
      <div>
        <FilterCard 
          badges={['FOLLOWING', 'GROUPS', 'ALL']}
          allBadge="ALL"
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          customFilterText="Filter posts:"
        />
      </div>
      <PostFeed showUserId={session?.user.id} filterHomeFeed={filter || "all"}/>
    </div>
  )
}
