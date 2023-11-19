import React from 'react'
import { Users, Home, MessageCircle, MailPlus, BadgePlus, Loader2, CircleOff } from "lucide-react";
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';
import { ScrollArea } from './ui/scroll-area';
import { useUserData } from '@/context/userData';
import { colors } from '@/lib/consts';

export const Sidebar: React.FC = () => {

    const pathname = usePathname()

    const { groups } = useUserData()

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
                    {!groups && (
                        <div className='text-center text-white text-sm'>
                            <Loader2 className='mx-auto h-16 animate-spin' size={24} />
                        </div>
                    )}
                    {groups && groups.map((group: any) => {
                        return (
                            <Link href={`/groups/${group?.id}?show=groupPosts`} key={group?.id}>
                                <div className=" flex items-center justify-center lg:justify-start gap-2 w-full p-2 my-1 text-sm font-semibold hover:bg-muted  rounded-md" >
                                    {group?.image === null && (
                                        <div className={`h-8 w-8 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>

                                    )}
                                    {group?.image !== null && colors.includes(group.image) && (
                                        <div className={`h-8 w-8 rounded-lg ${group.image}`}></div>
                                    )}
                                    <p className='hidden lg:block text-xs over w-24'>{group.name}</p>
                                </div>
                            </Link>
                        );
                    })}
                    {groups && groups.length === 0 && (
                        <>
                            <div className='text-center text-foreground text-sm hidden lg:block'>
                                You are not in any groups
                            </div>
                            <div className='text-center text-foreground text-sm lg:hidden block'>
                                <CircleOff className='h-4 w-4 mx-auto' />
                            </div>
                        </>

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
                    )
                }
                )}
            </div>
        </div>
    );
};
