"use client"
import NewGroup from "@/components/groups/newGroup"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function GroupsNewPage() {

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })

    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <NewGroup />
        </div>
    )

}