"use client"
import React, { use, useEffect, useState } from 'react'
import { Contact, Users, Search, Home, MessageCircle } from "lucide-react";
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {

    const pathname = usePathname()

    const sidebarItems = [
        {
            icon: <Home className={`h-8 w-8 ${pathname === '/home' && 'text-primary'}`} />,
            link: "/home",
            tooltip: "Home",
        },
        {
            icon: <Search className={`h-8 w-8 ${pathname === '/search' && 'text-primary'}`} />,
            link: "/search",
            tooltip: "Search",
        },
        {
            icon: <MessageCircle className={`h-8 w-8 ${pathname === '/messages' && 'text-primary'}`} />,
            link: "/messages",
            tooltip: "Messages",
        },
        {
            icon: <Users className={`h-8 w-8 ${pathname === '/communities' && 'text-primary'}`} />,
            link: "/communities",
            tooltip: "Communities",
        },
        {
            icon: <Contact className={`h-8 w-8 ${pathname === '/profile' && 'text-primary'}`} />,
            link: "/profile",
            tooltip: "Profile",
        },
    ];


    return (
        <div className="md:h-full h-16 md:w-16 w-full md:pt-6 pt-2 mb-4 flex md:flex-col flex-row sm:gap-12 xs:gap-10 gap-8 items-center md:justify-start justify-center md:border-r border-t">

            {sidebarItems.map((item: any) => {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={item.link} key={item.link}>
                                    {item.icon}
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
