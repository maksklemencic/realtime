"use client"
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useUserData } from '@/context/userData'

type BreadCrumbItem = {
    name: string,
    link: string,
}

function BreadCrumb() {

    const pathname = usePathname()
    const [userName, setUserName] = React.useState<string>('')
    const [groupName, setGroupName] = React.useState<string>('')
    const { groups } = useUserData()


    function displayBreadcrumbs() {

        const tokens = getBreadcrumbs();
        return (
            <div className='w-full h-full flex justify-start items-center px-4'>
                {tokens.map((item, index) => {
                    return (
                        <div key={index}>
                            <Link href={item.link}>
                                <div key={index} className={`pl-4 pb-1 text-md font-semibold flex items-center gap-4 ${index >= tokens.length - 1 ? 'text-foreground' : 'text-gray-500'} hover:text-foreground`}>
                                    {item.name}
                                    <ChevronRight className={`h-4 w-4 ${index >= tokens.length - 1 && 'hidden'}`} />
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    useEffect(() => {
        if (groups) {
            setGroupName(groups.find(group => group.id === pathname.split('/')[2])?.name)
        }
    }, [groups, pathname])

    function getUserName(userId: string) {
        fetch('/api/users?query=&id=' + userId)
            .then(res => res.json())
            .then(data => {
                setUserName(data[0].name)
            })
            .catch(err => console.log(err))
    }

    function getBreadcrumbs() {
        const path = pathname.split('/')
        const tokens = path.filter((item) => item != '')

        let newTokens: BreadCrumbItem[] = []


        if (tokens[0] === 'users') {

            getUserName(tokens[1])
            newTokens = [
                { name: userName !== '' ? userName : "Profile", link: '/users/' + tokens[1] + '?show=posts' },
            ]
            if (tokens.length === 3 && tokens[2] === 'edit') {
                newTokens.push({ name: "Edit profile", link: '/users/' + tokens[1] + '/edit' })
            }
            else if (tokens.length === 3 && tokens[2] === 'friends') {
                newTokens.push({ name: "Friends", link: '/users/' + tokens[1] + '/friends' })
            }
        }
        else if (tokens[0] === 'home') {
            newTokens = [
                { name: 'Home', link: '/home' },
            ]
            
            if (tokens.length === 2 && tokens[1] === 'new') {
                newTokens.push({ name: 'New', link: '/home/new' })
            }
        }
        else if (tokens[0] === 'search' && tokens.length === 1) {
            newTokens = [
                { name: 'Search', link: '/search' },
            ]
        }
        else if (tokens[0] === 'post' && tokens.length === 2) {
            newTokens = [
                { name: 'Home', link: '/home' },
                { name: 'Post', link: '/post/' + tokens[1] },
            ]
        }
        else if (tokens[0] === 'groups') {
            
            newTokens = [
                { name: 'My groups', link: '/groups' },
            ]

            if (tokens.length >= 2) {
                if (tokens[1] === 'new') {
                    newTokens.push({ name: 'New group', link: '/groups/new' })
                }
                else {
                    newTokens.push({ name: groupName !== '' ? groupName : 'Group', link: '/groups/' + tokens[1] + '?show=groupPosts' })
                }
            }
            if (tokens.length == 3 && tokens[2] === 'edit') {
                newTokens.push({ name: 'Edit', link: '/groups/' + tokens[1] + '/edit' })
            }
        }

        return newTokens;
    }



    return (
        <div className='h-14'>
            {displayBreadcrumbs()}
        </div>
    )
}

export default BreadCrumb