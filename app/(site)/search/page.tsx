"use client"
import FilterCard from '@/components/filter'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { colors } from '@/lib/consts'
import { User, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/dist/client/components/navigation'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'

interface HighlightedSubstringProps {
	text: string;
	queryText: string;
}

export default function SearchPage() {

	const { data: session } = useSession()

	const [selectedFilters, setSelectedFilters] = React.useState<any[]>(['POSTS', 'GROUPS', 'USERS'])
	const [queryText, setQueryText] = React.useState<string>('')

	const [queryPosts, setQueryPosts] = React.useState<any[]>([])
	const [postsDisplayCount, setPostsDisplayCount] = React.useState<number>(5)

	// not done yet
	const [queryGroups, setQueryGroups] = React.useState<any[]>([])
	const [groupDisplayCount, setGroupDisplayCount] = React.useState<number>(5)

	const [queryUsers, setQueryUsers] = React.useState<any[]>([])
	const [usersDisplayCount, setUsersDisplayCount] = React.useState<number>(5)

	const [loading, setLoading] = React.useState(false)

	const searchParams = useSearchParams()!
	const query = searchParams.get('query');
	const filter = searchParams.get('filter');

	const router = useRouter()
	const pathname = usePathname()


	useEffect(() => {
		if (query != undefined) {
			setQueryText(query)
			handleSearch()
		}

	}, [query])

	useEffect(() => {
		if (filter != undefined) {

			if (filter === 'all') {
				setSelectedFilters(['POSTS', 'GROUPS', 'USERS'])
			}
			else {
				setSelectedFilters(filter.split('-').map((item) => item.toUpperCase()))
			}
		}
	}, [filter])


	function handleSearch() {

		router.push(pathname + '?' + createQueryString('query', queryText))

		setLoading(true);
		setPostsDisplayCount(5);
		setUsersDisplayCount(5);
		setGroupDisplayCount(5);


		if (selectedFilters.includes('POSTS')) {
			fetch(`/api/posts?content=${(query) ? query : queryText}`)
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
		if (selectedFilters.includes('GROUPS')) {
			fetch(`/api/groups?name=${queryText}`)
				.then((res) => res.json())
				.then((data) => {
					setQueryGroups(data)
				})
				.catch((err) => {
					console.log(err)
					setLoading(false)
					return;
				})
		}

		if (selectedFilters.includes('USERS')) {
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

	function getAdminName(adminId: string, users: any[]) {
		return users.find((user: any) => user.id === adminId)?.name
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

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams)
			params.set(name, value)

			return params.toString()
		},
		[searchParams]
	)

	return (

		<div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
			<FilterCard
				badges={['POSTS', 'GROUPS', 'USERS', 'EVERYTHING']}
				allBadge='EVERYTHING'
				selectedFilters={selectedFilters}
				setSelectedFilters={setSelectedFilters}
			/>
			<div className=' mt-6 flex gap-2'>

				<Input placeholder="Search" value={queryText} autoFocus onChange={(e: any) => setQueryText(e.target.value)} />
				<Button className='' onClick={() => handleSearch()}>Search</Button>

			</div>
			{query == undefined ? (
				<div className='w-full h-48 flex justify-center items-center'>
					<p className='text-md text-gray-400 mt-2'>Try searching for posts, groups or users</p>
				</div>
			) : (
				<div className='my-6'>
					<div className='flex gap-2'>
						{query != undefined && query !== '' && (
							<>
								<p className='text-primary'>Results for: </p>
								<p className='font-bold'>{query}</p>
							</>
						)}
					</div>
					{/* Posts */}
					{selectedFilters.includes('POSTS') && (
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


					{/* Groups */}
					{selectedFilters.includes('GROUPS') && (
						<div className='mt-6'>
							<div className='flex items-center justify-between'>
								<p className='font-semibold'>Groups</p>
								<p className='text-sm text-gray-400 ml-2'>{queryGroups.length} results</p>
							</div>
							<Separator className='my-2' />
							{queryGroups.length === 0 && (
								<div className='w-full flex justify-center items-center'>
									<p className='text-md text-gray-400 mt-2'>No groups found</p>
								</div>
							)}
							{queryGroups.map((group: any, index: any) => (
								<>
									{index < groupDisplayCount && (
										<Card key={group.id} className='mb-2'>
											<CardContent className='flex items-center justify-between p-3'>
												<Link href={'/groups/' + group?.id + '?show=groupPosts'}
													// target="_blank"
													// style={{
													// 	pointerEvents: (!group?.userIds.includes(session?.user?.in)) ? "none" : "auto",
													// }}
													className='flex justify-between w-full '>

													<div className='mr-4'>
														{group?.image === null && (
															<div className={`h-10 w-10 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>

														)}
														{group?.image !== null && colors.includes(group.image) && (
															<div className={`h-10 w-10 rounded-lg ${group.image}`}></div>
														)}

														{group?.image !== null && !colors.includes(group.image) && (
															<Avatar className=" h-10 w-10 rounded-lg">
																<AvatarImage src={group?.image} />
																<AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><Users /></AvatarFallback>
															</Avatar>
														
														)}

													</div>
													<div className=' w-full '>
														<div className='font-bold  text-sm'>{group?.name}</div>
														<div className='text-gray-400 text-sm'>{group?.userIds.length} {(group?.userIds.length === 1) ? 'member' : 'members'}</div>
													</div>
													<div className='flex flex-col w-32'>
														<p className='text-xs'>Admin</p>
														<Link className='w-32' href={'/users/' + group?.adminId + '?show=posts'}>
															<Badge >{getAdminName(group?.adminId, group?.users)}</Badge>
														</Link>
													</div>

												</Link>

											</CardContent>
										</Card>)}
								</>
							))}
							{queryGroups.length > groupDisplayCount && (
								<div>
									<Button className='w-full' onClick={() => setGroupDisplayCount(queryGroups?.length)}>View all {queryGroups?.length} groups</Button>
								</div>
							)}
						</div>
					)}

					{/* Users */}
					{selectedFilters.includes('USERS') && (
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