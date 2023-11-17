
"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { User } from 'lucide-react'
import { useSearchParams } from 'next/dist/client/components/navigation'
import Link from 'next/link'
import React, { useEffect } from 'react'

interface HighlightedSubstringProps {
	text: string;
	queryText: string;
}

export default function SearchPage() {

	const [selectedFilters, setSelectedFilters] = React.useState<any[]>(['posts', 'groups', 'users'])
	const [queryText, setQueryText] = React.useState<string>('')
	
	const [queryPosts, setQueryPosts] = React.useState<any[]>([])
	const [postsDisplayCount, setPostsDisplayCount] = React.useState<number>(5)

	// not done yet
	const [queryGroups, setQueryGroups] = React.useState<any[]>([])

	const [queryUsers, setQueryUsers] = React.useState<any[]>([])
	const [usersDisplayCount, setUsersDisplayCount] = React.useState<number>(5)

	const [loading, setLoading] = React.useState(false)

	const searchParams = useSearchParams();
	const query = searchParams.get('query');

	useEffect(() => {
		if (selectedFilters.length === 0) {
			setSelectedFilters(['everything'])
		}
		if (selectedFilters.includes('everything')) {
			setSelectedFilters(['posts', 'groups', 'users'])
		}

	}, [selectedFilters])

	useEffect(() => {
		if (query != undefined) {
			setQueryText(query)
			handleSearch()
		}
	}, [query])

	function handleFilterSelection(filter: string) {
		if (selectedFilters.includes(filter)) {
			setSelectedFilters(selectedFilters.filter((item: string) => item !== filter))
		} else {
			setSelectedFilters([...selectedFilters, filter])
		}
	}

	function handleSearch() {
		setLoading(true);
		setPostsDisplayCount(5);
		setUsersDisplayCount(5);
		if (selectedFilters.includes('posts')) {
			fetch(`/api/posts?content=${queryText}`)
				.then((res) => res.json())
				.then((data) => {
					setQueryPosts(data)
				})
				.catch((err) => {
					console.log(err)
					setLoading(false)
					return;
				})
		}
		// if (selectedFilters.includes('groups')) {
		// 	fetch(`/api/groups?name=${queryText}`)
		// 		.then((res) => res.json())
		// 		.then((data) => {
		// 			setQueryGroups(data)
		// 		})
		// 		.catch((err) => {
		// 			console.log(err)
		// 			setLoading(false)
		// 			return;
		// 		})
		// }
		if (selectedFilters.includes('users')) {
			fetch(`/api/users?query=${queryText}`)
				.then((res) => res.json())
				.then((data) => {
					setQueryUsers(data)
				})
				.catch((err) => {
					console.log(err)
					setLoading(false)
					return;
				})
		}
	}

	const HighlightedSubstring: React.FC<HighlightedSubstringProps> = ({ text, queryText }) => {
		if (!queryText || queryText === '') {
			return <p className='text-md'>{text}</p>;
		}

		const parts = text.split(new RegExp(`(${queryText})`, 'gi'));

		return (
			<p className='text-md'>
				{parts.map((part, index) => (
					part.toLowerCase() === queryText.toLowerCase() ? (
						<span key={index} className='text-primary font-semibold'>{part}</span>
					) : (
						<span key={index}>{part}</span>
					)
				))}
			</p>
		);
	};

	return (

		<div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
			<div className='my-2 flex md:gap-4 gap-2 items-center'>
				<p className='hidden md:block text-sm'>Filter by:</p>
				<div className='flex md:gap-4 gap-2'>
					<Badge className={`${selectedFilters.includes('posts') ? 'bg-primary' : 'bg-gray-400'} h-7 text-white hover:cursor-pointer hover:border-muted`} onClick={() => handleFilterSelection('posts')}>POSTS</Badge>
					<Badge className={`${selectedFilters.includes('groups') ? 'bg-primary' : 'bg-gray-400'} h-7 text-white hover:cursor-pointer hover:border-muted`} onClick={() => handleFilterSelection('groups')}>GROUPS</Badge>
				</div>
				<div className='flex md:gap-4 gap-2'>
					<Badge className={`${selectedFilters.includes('users') ? 'bg-primary' : 'bg-gray-400'} h-7 text-white hover:cursor-pointer hover:border-muted`} onClick={() => handleFilterSelection('users')}>USERS</Badge>
					<Badge className={`${selectedFilters.includes('everything') ? 'bg-primary' : 'bg-gray-400'} h-7 text-white hover:cursor-pointer hover:border-muted`} onClick={() => handleFilterSelection('everything')}>EVERYTHING</Badge>
				</div>
			</div>
			<div className=' mt-6 flex gap-2'>

				<Input placeholder="Search" autoFocus onChange={(e: any) => setQueryText(e.target.value)} />
				<Link href={{ query: { query: queryText } }}>
					<Button className='' onClick={() => handleSearch()}>Search</Button>
				</Link>
			</div>
			{query == undefined ? (
				<div className='w-full h-48 flex justify-center items-center'>
					<p className='text-md text-gray-400 mt-2'>Try searching for posts, groups or users</p>
				</div>
			) : (
				<div className='my-6'>
					<div className='flex gap-2'>
						<p className='text-primary'>Results for: </p>
						<p className='font-bold'>{query}</p>
					</div>
					{/* Posts */}
					{selectedFilters.includes('posts') && (
						<div className='mt-6'>
							<div className='flex items-center justify-between'>
								<p className='font-semibold'>Posts</p>
								<p className='text-sm text-gray-400 ml-2'>{queryPosts.length} results</p>
							</div>
							<Separator className='my-2' />
							{queryPosts.length === 0 && (
								<div className='w-full flex justify-center items-center'>
									<p className='text-md text-gray-400 mt-2'>No posts found</p>
								</div>
							)}
							{queryPosts.map((post: any, index: any) => (
								<Link href={'post/' + post?.id}>
									{index < postsDisplayCount && (
										<Card className='mb-2'>
											<CardContent className='px-4 py-2'>
												<div className='flex gap-1'>
													<p className='text-sm font-semibold'>{post.author.name} ● </p>
													<p className='text-gray-400 text-sm'>{post.author.email}</p>
												</div>
												<HighlightedSubstring text={post.content} queryText={query} />
											</CardContent>
										</Card>
									)}
								</Link>
							))}
							{queryPosts.length > postsDisplayCount && (
								<div>
									<Button className='w-full' onClick={() => setPostsDisplayCount(queryPosts?.length)}>View all {queryPosts?.length} posts</Button>
								</div>
							)}

						</div>

					)}
					{/* Users */}
					{selectedFilters.includes('users') && (
						<div className='mt-6'>
							<div className='flex items-center justify-between'>
								<p className='font-semibold'>Users</p>
								<p className='text-sm text-gray-400 ml-2'>{queryUsers.length} results</p>
							</div>
							<Separator className='my-2' />
							{queryUsers.length === 0 && (
								<div className='w-full flex justify-center items-center'>
									<p className='text-md text-gray-400 mt-2'>No users found</p>
								</div>
							)}
							{queryUsers.map((user: any, index: any) => (
								<>
								{index < usersDisplayCount && (
								<Card key={user.id} className='mb-2'>
									<CardContent className='flex items-center justify-between p-3'>
										<Link href={'http://localhost:3000/users/' + user?.id + '?show=posts'}
											className='flex justify-between w-full'>
											<div className='mr-4'>
												<Avatar className=" h-10 w-10 rounded-lg">
													<AvatarImage src={user?.image} />
													<AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
												</Avatar>
											</div>
											<div className=' w-full '>
												<div className='font-bold  text-sm'>{user?.name}</div>
												<div className='text-gray-400 text-sm'>{user?.email}</div>
											</div>

										</Link>
										
									</CardContent>
								</Card>)}
								</>
							))}
							{queryUsers.length > usersDisplayCount && (
								<div>
									<Button className='w-full' onClick={() => setPostsDisplayCount(queryUsers?.length)}>View all {queryUsers?.length} users</Button>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	)
}