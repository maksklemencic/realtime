"use client"
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type BreadCrumbItem = {
    name: string,
    link: string,
}

function BreadCrumb() {

    const pathname = usePathname()

    function displayBreadcrumbs() {


        const tokens = getBreadcrumbs();

        return (
            <div className='w-full h-full flex justify-start items-center px-4'>
                {tokens.map((item, index) => {
                    return (
                        <Link href={item.link}>
                        <div key={index} className={`pl-4 pb-1 text-md font-semibold flex items-center gap-4 ${index >= tokens.length - 1 ? 'text-foreground' : 'text-gray-500'} hover:text-foreground`}>
                            {item.name}
                            <ChevronRight className={`h-4 w-4 ${index >= tokens.length - 1 && 'hidden'}`} />
                        </div>
                        </Link>
                    )
                })}
            </div>
        )

    }


    function getBreadcrumbs() {
        const path = pathname.split('/')
        const tokens = path.filter((item) => item != '')
        console.log(tokens)
        let newTokens: BreadCrumbItem[] = []

        if (tokens[0] === 'users' && tokens.length === 2) {
            newTokens = [
                { name: "Profile", link: '/users/' + tokens[1] }
            ]
        }
        else if (tokens[0] === 'home' && tokens.length === 2) {
            newTokens = [
                { name: 'Home', link: '/home' },
                { name: "New post", link: '/home/new' }
            ]
        }
        else if (tokens[0] === 'home' && tokens.length === 1) {
            newTokens = [
                { name: 'Home', link: '/home' },
            ]
        }
        else if (tokens[0] === 'search' && tokens.length === 1) {
            newTokens = [
                { name: 'Search', link: '/search' },
            ]
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