"use client"
import React, { useEffect, useState } from 'react'
import { Contact, Users, Search, Home, MessageCircle, PlusCircle, Heart, MailPlus, BadgePlus } from "lucide-react";
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { ScrollArea } from './ui/scroll-area';

export const Sidebar: React.FC = () => {

    const pathname = usePathname()

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
            link: "/home?new",
            tooltip: "Post",
        },
        {
            icon: <BadgePlus />,
            link: "/groups/new",
            tooltip: "Group",
        },
    ];


    return (
        <div className="md:h-full h-16 md:w-20 lg:w-52 w-full md:pt-6 pt-2 pb-4 px-4 flex flex-col justify-between md:shadow-lg md:border-t-0 border-t">
            <div className='flex md:flex-col flex-row sm:gap-12 xs:gap-10 gap-8 md:gap-4 items-center md:items-start md:justify-start justify-center'>
                {sidebarItems.map((item: any) => {
                    return (
                        <>
                            <TooltipProvider >
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
                }
                )}
                <ScrollArea className={`hidden md:flex h-[calc(100vh-400px)] min-h-[48px] w-full `} >
                    {testGroups.map((group: any) => {
                        return (
                            <Link href={`/groups/${group.name}`} key={group.name}>
                                <div className="h-12 flex items-center justify-center lg:justify-start gap-2 w-full p-2 text-sm font-semibold hover:bg-primary hover:text-white rounded-lg" >
                                    {/* <img src={group.image} className="h-6 w-6 rounded-full" /> */}
                                    <div className="h-6 w-6 rounded-lg bg-blue-200"></div>
                                    <p className='hidden lg:block text-xs'>{group.name}</p>
                                </div>
                            </Link>
                        );
                    }
                    )}
                </ScrollArea>
            </div>
            <div className="hidden md:block">
                <p className="w-full border-b text-sm p-2 mb-2">New</p>
                {actions.map((item: any) => {
                    return (
                        <TooltipProvider >
                            <Tooltip >
                                <TooltipTrigger asChild>
                                    <Link href={item.link} key={item.link} className="w-full ">
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
