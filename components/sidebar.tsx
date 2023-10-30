"use client"
import React, {useEffect, useState } from 'react'
import { Contact, Users, Search, Home, MessageCircle, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {

    const pathname = usePathname()

    const iconSize = "h-6 w-6";
    const sidebarItems = [
        {
            icon: <Home  />,
            link: "/home",
            tooltip: "Home",
        },
        {
            icon: <Search />,
            link: "/search",
            tooltip: "Search",
        },
        {
            icon: <Users  />,
            link: "/groups",
            tooltip: "Groups",
        },
        {
            icon: <MessageCircle  />,
            link: "/messages",
            tooltip: "Messages",
        },
        // {
        //     icon: <Contact className={`${iconSize} ${pathname === '/profile' && 'text-primary'}`} />,
        //     link: "/profile",
        //     tooltip: "Profile",
        // },
        {
            icon: <PlusCircle  />,
            link: "/create",
            tooltip: "Create post",
        },
        
    ];

    const addtionalSidebarItems = [
        {
            icon: <PlusCircle />,
            link: "/create",
            tooltip: "Create post",
        },
    ]


    return (
        <div className="bg-accent md:h-full h-16 md:w-20 lg:w-52 w-full md:pt-6 pt-2 pb-4 px-4 flex md:flex-col flex-row sm:gap-12 xs:gap-10 gap-8 items-center md:items-start md:justify-start justify-center md:border-0 border-t">

            {sidebarItems.map((item: any) => {
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
            <div className="hidden">

            </div>

        </div>
    );
};

// buttons
/*
 
home (posts from all the communities you're in + maybe all the postt from people you follow) + ability to filter to just followers or just communities (all or just some combination)
search (able to search for communities and people)
messages (either message people that you follow or message people in communities that you're in or both), individual or group chats
communities ? (which communities you're in)
  profile (your profile and the ability to edit it, see your posts, see your comments, see your followers, see who you follow)

*/
