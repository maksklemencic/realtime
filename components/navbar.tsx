"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, Sun, Bell, User, Settings, LogOut, LucideUserCog, UserCog, SunMoon, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Input } from './ui/input'

function Navbar() {
    const { theme, setTheme } = useTheme()
    const { data: session } = useSession()

    return (
        <nav className='h-16 border-b flex justify-between'>

            <div className=" flex md:hidden items-center px-4">
                <Link href='/search'>
                    <Search className="h-[1.5rem] w-[1.5rem]" />
                </Link>
            </div>
            <div className="hidden lg:ml-48 ml-20 md:flex items-center px-4">
                <Input placeholder="Search" />
            </div>
            <ul className='flex items-center justify-end gap-4 h-full px-4'>
                {/* {session?.user?.name}  {session?.user?.email} */}
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="hover:cursor-pointer h-10 w-10 rounded-lg">
                                <AvatarImage src={session?.user!.image!} />
                                <AvatarFallback className='hover:cursor-pointer h-10 w-10 rounded-lg bg-background border hover:bg-accent'><User /></AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align='end'>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link href={"/users/" + session?.user.id + '?show=posts'}>
                                    <DropdownMenuItem className='hover:cursor-pointer'>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href={"/users/" + session?.user.id + "/edit"}>
                                    <DropdownMenuItem className='hover:cursor-pointer'>
                                        <UserCog className="mr-2 h-4 w-4" />
                                        <span>Edit profile</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup >
                                <DropdownMenuItem disabled>
                                    {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
                                    {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
                                    {theme === "system" && <SunMoon className="mr-2 h-4 w-4" />}
                                    <span >Appearance</span>

                                </DropdownMenuItem>
                                <DropdownMenuCheckboxItem
                                    checked={theme === "system"}
                                    onCheckedChange={() => setTheme("system")}
                                    className='hover:cursor-pointer'
                                >
                                    System
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={theme === "light"}
                                    onCheckedChange={() => setTheme("light")}
                                    className='hover:cursor-pointer'
                                >
                                    Light
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={theme === "dark"}
                                    onCheckedChange={() => setTheme("dark")}
                                    className='hover:cursor-pointer'
                                >
                                    Dark
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()} className='text-destructive font-semibold hover:cursor-pointer'>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar