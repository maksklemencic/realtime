"use client"
import GroupCard from "@/components/groups/groupCard"
import GroupUsers from "@/components/groups/groupUsers"
import PostFeed from "@/components/posts/postFeed"
import TabSelector from "@/components/tabs"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function GroupsGroupPage({ params }: { params: { groupId: string } }) {

    const { data: session } = useSession();

    const [group, setGroup] = useState<any>({});
    const [loading, setLoading] = useState(true);
    
    const searchParams = useSearchParams();
    const show = searchParams.get('show');

    useEffect(() => {
        fetch(`/api/groups`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setGroup(data.filter((group: any) => group.id === params.groupId)?.[0]);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching group:', error);
            });
    }, [])

    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            {loading ? (
                <div className='text-center text-white text-2xl font-bold'>
                    <Loader2 className='mx-auto h-24 animate-spin' size={24} />
                </div>

            ) : (
                <>
                    <GroupCard group={group} setGroup={setGroup} key={group?.id} sessionUserId={session?.user?.id} />
                    <div className="my-4">
                        <TabSelector param='show' defaultTab='groupPosts' tabs={['groupPosts', 'members']} tabNames={['Posts', 'Members']} />
                    </div>
                    {show === 'groupPosts' && (
                        <PostFeed showUserId={session?.user.id} groupId={params.groupId} />
                    )}
                    {show === 'members' && (
                        <GroupUsers group={group} setGroup={setGroup} sessionUserId={session?.user?.id}/>
                    )}
                </>
            )}
        </div >
    )
}