"use client"
import { Filter } from 'lucide-react'
import React, { use, useCallback, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface FilterCardProps {
    badges: string[],
    allBadge: string,
    selectedFilters: any[],
    setSelectedFilters: (filters: any[]) => void,
}

export default function FilterCard(props: FilterCardProps) {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()!

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {

        if (props.selectedFilters.length === 0) {
            props.setSelectedFilters([props.allBadge])
        }
        if (props.selectedFilters.includes(props.allBadge)) {
            props.setSelectedFilters(props.badges?.filter((item: string) => item !== props.allBadge))
        }

        if (props.selectedFilters.length === 3) {
            router.push(pathname + '?' + createQueryString('filter', 'all'));
        }
        else {
            router.push(pathname + '?' + createQueryString('filter', props.selectedFilters?.map((filter) => filter.toLowerCase()).join('-')));
        }

    }, [props.selectedFilters])


    function handleFilterSelection(filter: string) {
        if (props.selectedFilters.includes(filter)) {
            props.setSelectedFilters(props.selectedFilters.filter((item: string) => item !== filter))
        } else {
            props.setSelectedFilters([...props.selectedFilters, filter])
        }
    }

    return (
        <div>
            <Card className='w-full p-0'>
                <CardContent className='h-fit p-0'>
                    <div className='p-2  flex flex-col xs:flex-row items-start md:gap-4 gap-2 xs:items-center flex-wrap'>
                        <p className='flex gap-2 items-center text-sm'>
                            <Filter className='h-4 w-4' />
                            Filter by:
                        </p>
                        <div className='flex flex-wrap justify-start gap-2 md:gap-4 lg:gap-6 m-2'>

                            {props.badges.map((badge, i) => {
                                return (
                                    <Badge key={i}
                                        className={`h-8 w-fit ${props.selectedFilters.includes(badge) ? 'bg-primary' : 'bg-gray-400'} text-white hover:cursor-pointer hover:border-muted`}
                                        onClick={() => handleFilterSelection(badge)}
                                    >
                                        {badge}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
