
"use client"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { redirect, useSearchParams } from 'next/dist/client/components/navigation'
import React, { use, useEffect } from 'react'

import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
	UserCog,
	Users,
} from "lucide-react"

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command"
import Link from 'next/link'

export default function SearchPage() {
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/login')
		}
	})

	const [open, setOpen] = React.useState(true)
	const searchParams = useSearchParams();
	const search = searchParams.get('search');

	const [queryText, setQueryText] = React.useState('')

	useEffect(() => {
		if (search != null) {
			setOpen(false)
		}
	}, [search])

	return (
		<>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search or select command" onValueChange={(e: any) => setQueryText(e)}/>
				<CommandList className=''>

					{/* <CommandEmpty>
						<p>Search in:</p>
						<div className='rounded bg-muted mx-2 mb-2 px-2 py-1 text-sm h-10 flex items-center'>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Posts</span>
						</div>
						<div className='rounded bg-muted mx-2 mb-2 px-2 py-1 text-sm h-10 flex items-center'>
							<User className="mr-2 h-4 w-4" />
							<span>Users</span>
						</div>
						<div className='rounded bg-muted mx-2 mb-2 px-2 py-1 text-sm h-10 flex items-center'>
							<Users className="mr-2 h-4 w-4" />
							<span>Groups</span>
						</div>

					</CommandEmpty> */}
					<p className=' text-xs text-gray-400 ml-4 mt-2 mb-1'>Filter search</p>
					<div className='flex justify-between gap-1 mb-2'>

						
						<Link 
							href={{ query: { search: 'posts', query: queryText } }}
							className='rounded border mx-2 px-2 py-1 text-sm h-10 flex items-center justify-center w-full hover:cursor-pointer hover:bg-muted'
						>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Posts</span>
						</Link>
						<Link 
							href={{ query: { search: 'users', query: queryText } }}
							className='rounded border mx-2 px-2 py-1 text-sm h-10 flex justify-center items-center w-full hover:cursor-pointer hover:bg-muted'
						>
							<User className="mr-2 h-4 w-4" />
							<span>Users</span>
						</Link>
						
						<Link 
							href={{ query: { search: 'groups', query: queryText } }}
							className='rounded border mx-2 px-2 py-1 text-sm h-10 flex justify-center items-center w-full hover:cursor-pointer hover:bg-muted'
						>
							<Users className="mr-2 h-4 w-4" />
							<span>Groups</span>
						</Link>
					</div>
					{/* <CommandGroup heading="Search">
						<CommandItem>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Posts</span>
						</CommandItem>
						<CommandItem>
							<User className="mr-2 h-4 w-4" />
							<span>Users</span>
						</CommandItem>
						<CommandItem>
							<Users className="mr-2 h-4 w-4" />
							<span>Groups</span>
						</CommandItem>
					</CommandGroup> */}

					<CommandSeparator />
					<CommandGroup heading="Actions">
						<Link href={'/home/new'} >
							<CommandItem className='hover:cursor-pointer'>
								<User className="mr-2 h-4 w-4" />
								<span>New post</span>
							</CommandItem>
						</Link>
						<Link href={'/groups/new'} >
						<CommandItem className='hover:cursor-pointer'>
							<UserCog className="mr-2 h-4 w-4" />
							<span>New group</span>
						</CommandItem>
						</Link>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<Link href={'/users/' + session?.user.id} >
							<CommandItem className='hover:cursor-pointer'>
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</CommandItem>
						</Link>
						{/* <Link href={'/users/' + session?.user.id + '/edit'} >
							<CommandItem className='hover:cursor-pointer'>
								<UserCog className="mr-2 h-4 w-4" />
								<span>Edit profile</span>
							</CommandItem>
						</Link> */}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>

	)
}