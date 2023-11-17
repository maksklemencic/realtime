
"use client"
import EditGroup from '@/components/groups/editGroup';
import { useUserData } from '@/context/userData';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'



export default function GroupsGroupEditPage({ params }: { params: { groupId: string } }) {

    const { data: session } = useSession();
    const router = useRouter()
    const { groups } = useUserData()

    const [group, setGroup] = useState<any>({});

    useEffect(() => {
        if (session?.user?.id === undefined || !groups) return
        const group = groups?.find(group => group.id === params.groupId)
        if (session?.user?.id !== group?.adminId) {
            router.push('/groups/' + params.groupId + '?show=groupPosts')
        }

    }, [session, params])

    useEffect(() => {
        fetch(`/api/groups/${session?.user?.id}?includeUserData=true`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setGroup(data.filter((group: any) => group.id === params.groupId)?.[0]);
            })
            .catch((error) => {
                console.error('Error fetching group:', error);
            });
    }, [])


    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <EditGroup group={group}/>
        </div>
    )
}