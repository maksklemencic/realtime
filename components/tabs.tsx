import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React from 'react'

interface TabSelectorProps {
    param: string,
    defaultTab: string,
    tabs: string[],
    tabNames: string[],
}

export default function TabSelector(props: TabSelectorProps) {

    const searchParams = useSearchParams();
    const param = searchParams.get(props.param);

    function capilaize(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    return (
        <div>
            <div className='h-10 rounded-lg border w-full flex justify-between mx-auto mb-4 bg-card'>
                {props.tabs.map((tab, i) => {
                    return (
                        <Link
                            key={i}
                            href={{ query: { [props.param || props.defaultTab]: tab } }}
                            className={`w-full flex justify-center items-center m-1 rounded ${param === tab && 'bg-primary text-white'}`}
                        >
                            <p className=' text-sm font-semibold'>{props.tabNames[i]}</p>
                        </Link>
                    )}
                )}
            </div>
        </div>
    )
}