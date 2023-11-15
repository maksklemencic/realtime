"use client"
import React, { use, useEffect, useState } from 'react'
import { Contact, Users, Search, Home, MessageCircle, PlusCircle, Heart, MailPlus, BadgePlus, Loader2 } from "lucide-react";
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import { useSession } from 'next-auth/react';

export const Sidebar: React.FC = () => {

    const pathname = usePathname()

    const { data: session, status } = useSession()
    const [groups, setGroups] = useState([])
    const [groupsLoading, setGroupsLoading] = useState(true)

    useEffect(() => {
        setGroupsLoading(true)
        fetch(`/api/groups/${session?.user?.id}`)
            .then(res => res.json())
            .then(data => {
                setGroups(data)
                setGroupsLoading(false)
            })

    }, [])

    const iconSize = "h-6 w-6";
    const sidebarItems = [
        {
            icon: <Home />,
            link: "/home",
            tooltip: "Home",
        },
        {
            icon: <MessageCircle />,
            link: "/chat",
            tooltip: "Chat",
        },
        {
            icon: <Users />,
            link: "/groups",
            tooltip: "Groups",
        },
    ];

    const testGroups = [
        {
            name: "test group 1",
            image: "https://unsplash.com/photos/a-scuba-diver-swims-over-a-colorful-coral-reef-_tDdlCJIwOA",
        },
        {
            name: "test group 2",
            image: "https://unsplash.com/photos/a-red-house-sitting-on-top-of-a-rock-next-to-the-ocean-6w9qArq4DT4",
        }
    ];


    const actions = [
        {
            icon: <MailPlus />,
            link: "/home/new",
            tooltip: "New Post",
        },
        {
            icon: <BadgePlus />,
            link: "/groups/new",
            tooltip: "New Group",
        },
    ];

    const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
    ]


    return (
        <div className="md:h-full h-16 md:w-20 lg:w-52 w-full md:pt-6 pt-2 pb-4 px-4 flex flex-col justify-between md:shadow-lg md:border-t-0 border-t">
            <div className='flex md:flex-col flex-row sm:gap-12 xs:gap-10 gap-8 md:gap-4 items-center md:items-start md:justify-start justify-center'>
                {sidebarItems.map((item, index) => {
                    return (
                        <>
                            <TooltipProvider key={index}>
                                <Tooltip >
                                    <TooltipTrigger asChild>
                                        <Link href={item.link} key={item.link} className="w-full flex justify-center">
                                            <div className={`flex items-center justify-center lg:justify-start gap-2 w-fit md:w-full p-2 text-sm font-semibold ${pathname === item.link && 'rounded-lg bg-primary text-white'}`} >
                                                {item.icon}
                                                <p className='hidden lg:block'>{item.tooltip}</p>
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{item.tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    );
                })}
                <div className="flex md:hidden w-full">
                    {actions
                        .filter((item: any) => item.tooltip === 'New Post')
                        .map((item, index) => {
                            return (
                                <TooltipProvider key={index}>
                                    <Tooltip >
                                        <TooltipTrigger asChild>
                                            <Link href={item.link} key={item.link} className="w-full flex justify-center">
                                                <div className={`flex items-center justify-center lg:justify-start gap-2 w-fit md:w-full p-2 text-sm font-semibold ${pathname === item.link && 'rounded-lg bg-primary text-white'}`} >
                                                    {item.icon}
                                                    <p className='hidden lg:block'>{item.tooltip}</p>
                                                </div>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                </div>

                <ScrollArea className={`hidden md:flex h-[calc(100vh-400px)] min-h-[48px] w-full `} >
                    {groupsLoading && (
                        <div className='text-center text-white text-sm'>
                            <Loader2 className='mx-auto h-16 animate-spin' size={24} />
                        </div>
                    )}
                    {!groupsLoading && groups.map((group: any) => {
                        return (
                            <Link href={`/groups/${group?.id}?show=groupPosts`} key={group?.id}>
                                <div className=" flex items-center justify-center lg:justify-start gap-2 w-full p-2 my-1 text-sm font-semibold hover:bg-muted hover:text-white rounded-md" >
                                    {group?.image === null && (
                                        <div className={`h-8 w-8 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>

                                    )}
                                    {group?.image !== null && colors.includes(group.image) && (
                                        <div className={`h-8 w-8 rounded-lg ${group.image}`}></div>
                                    )}
                                    <p className='hidden lg:block text-xs'>{group.name}</p>
                                </div>
                            </Link>
                        );
                    })}
                    {!groupsLoading && groups.length === 0 && (
                        <div className='text-center text-white text-sm'>
                            You are not in any groups
                        </div>
                    )}
                </ScrollArea>
            </div>
            <div className="hidden md:block">
                <p className="w-full border-b text-sm p-2 mb-2">New</p>
                {actions.map((item, index) => {
                    return (
                        <TooltipProvider key={index}>
                            <Tooltip >
                                <TooltipTrigger asChild>
                                    <Link href={item.link} key={item.link} className="w-full">
                                        <div className={`flex items-center justify-center lg:justify-start gap-2 w-full p-2 text-sm font-semibold ${pathname === item.link && 'rounded-lg bg-primary text-white'}`} >
                                            {item.icon}
                                            <p className='hidden lg:block'>{item.tooltip}</p>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                }
                )}
            </div>

        </div>
    );
};
