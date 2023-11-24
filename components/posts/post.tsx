"use client"
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronRight, Heart, MapPin, MessageSquare, SkipBack, User, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'
import SkeletonPost from './skeletonPost'
import { usePathname, useSearchParams } from 'next/navigation'
import { colors, formatDateAndTime } from '@/lib/consts'
import { Badge } from '../ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"


type PostProps = {
    key: string,
    post: any,
    comments?: any,
    unlikePost?: (id: string) => void
}

export default function Post(props: PostProps) {

    const { data: session } = useSession()
    const [likes, setLikes] = React.useState<any[]>([]);
    const [comments, setComments] = React.useState<any[]>([]);
    const searchParams = useSearchParams()
    const search = searchParams.get('show')

    const pathname = usePathname()
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!props.post) return;
        fetch(`/api/like?postId=${props.post?.id}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setLikes(data);
            })
            .catch((error) => {
                console.error('Error fetching likes:', error);
            });
    }, [props.post?.id])

    useEffect(() => {
        if (!props.post || props.comments) return;
        fetch(`/api/posts/comments?post=${props.post?.id}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });
    }, [props.post])

    function handleLike() {
        if (!likes.find((item: any) => (item.userId === session?.user?.id))) {
            fetch(`/api/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: props.post.id,
                    userId: session?.user?.id
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then((data) => {
                    setLikes((likes) => [...likes, data]);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
        else {
            fetch(`/api/like?postId=${props.post.id}&userId=${session?.user?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then((data) => {
                    setLikes((likes) => likes.filter((item) => item.userId !== session?.user?.id));
                    if (props.unlikePost && search === 'liked') {
                        props.unlikePost(props.post.id);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }

    const handleNextClick = () => {
        setCurrentIndex((prevIndex: number) => (prevIndex + 1) % props.post?.imagesUrls?.length);
      };
    
      const handlePrevClick = () => {
        setCurrentIndex((prevIndex: number) => (prevIndex - 1 + props.post?.imagesUrls?.length) % props.post?.imagesUrls?.length);
      };

    return (
        <>
            {props.post ? (
                <>
                    <Card>
                        <CardContent className='p-4 pb-2'>
                            {pathname.includes('post') ? (
                                <>
                                    {PostContent()}
                                </>
                            ) : (
                                <Link href={'/post/' + props.post?.id}>
                                    {PostContent()}
                                </Link>
                            )}

                            <Separator className='my-2 mt-4' />
                            <div className='flex w-full justify-center'>
                                <div className='flex justify-evenly gap-4 w-4/5'>
                                    <div className='text-gray-400 text-sm'>{formatDateAndTime(props.post?.createdAt)}</div>
                                    <div className='flex gap-2 items-center '>
                                        {props.comments ? (
                                            <div className='text-gray-400 text-sm'>{props.comments?.length}</div>
                                        ) : (
                                            <>
                                                {comments ? (
                                                    <div className='text-gray-400 text-sm'>{comments?.length}</div>
                                                ) : (
                                                    <Skeleton className='h-4 w-4' />
                                                )}
                                            </>
                                        )}
                                        <MessageSquare className={`h-4 w-4 text-blue-400`} />
                                    </div>
                                    <div
                                        className={`flex gap-2 items-center text-red-500 hover:text-red-700 hover:cursor-pointer`}
                                        onClick={() => handleLike()}
                                    >
                                        <div className='text-gray-400 text-sm'>{likes.length}</div>
                                        <Heart className={`h-4 w-4 ${likes.find((item: any) => (item.userId === session?.user.id)) && 'fill-red-500'}`} />
                                    </div>

                                </div>
                            </div>

                        </CardContent>
                    </Card >
                </>
            ) : (
                <SkeletonPost />
            )}
        </>
    )

    function PostContent() {
        return <div className='flex justify-between'>
            <div className='mr-4 w-10'>
                {props.post?.group ? (
                    <>
                        {props?.post?.group?.image === null && (
                            <div className={`h-10 w-10 rounded-lg bg-muted border text-gray-white flex items-center justify-center relative`}>
                                <Users />
                                <Avatar className=" h-7 w-7 rounded-lg absolute right-0">
                                    <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                        <AvatarImage src={props.post?.author?.image} />
                                        <AvatarFallback className=' h-7 w-7 rounded-lg bg-background border'><User className='h-4 w-4' /></AvatarFallback>
                                    </Link>
                                </Avatar>
                            </div>
                        )}
                        {props?.post?.group?.image !== null && colors.includes(props.post?.group?.image) && (
                            <div className={`h-10 w-10 rounded-lg relative ${props?.post?.group?.image}`}>
                                <Avatar className=" h-7 w-7 rounded-lg absolute -right-2 -bottom-2">
                                    <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                        <AvatarImage src={props.post?.author?.image} />
                                        <AvatarFallback className=' h-7 w-7 rounded-lg bg-background border'><User className='h-4 w-4' /></AvatarFallback>
                                    </Link>
                                </Avatar>
                            </div>
                        )}
                        {props?.post?.group?.image !== null && !colors.includes(props.post?.group?.image) && (
                            <div className={`h-10 w-10 rounded-lg relative bg-background border`}>
                                <img className='h-10 w-10 rounded-lg' src={props?.post?.group?.image} alt={props?.post?.group?.name} />
                                <Avatar className=" h-6 w-6 rounded-lg absolute -right-2 -bottom-2">
                                    <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                                        <AvatarImage src={props.post?.author?.image} />
                                        <AvatarFallback className=' h-6 w-6 rounded-lg bg-background border'><User className='h-4 w-4' /></AvatarFallback>
                                    </Link>
                                </Avatar>
                            </div>

                        )}

                    </>
                ) : (
                    <Avatar className=" h-10 w-10 rounded-lg">
                        <Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>
                            <AvatarImage src={props.post?.author?.image} />
                            <AvatarFallback className=' h-10 w-10 rounded-lg bg-background border'><User /></AvatarFallback>
                        </Link>
                    </Avatar>
                )}
            </div>
            <div className=' w-full'>
                {props.post?.group ? (
                    <>
                        <div className='font-bold'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.group?.name}</Link></div>
                        <div className='text-gray-400 text-sm'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.name}</Link></div>
                    </>
                ) : (
                    <>
                        <div className='font-bold'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.name}</Link></div>
                        <div className='text-gray-400 text-sm'><Link href={'http://localhost:3000/users/' + props.post?.authorId + '?show=posts'}>{props.post?.author?.email}</Link></div>
                    </>
                )}
                {props.post?.location && (
                    <div className='mt-4 flex gap-2 items-center'>
                        <div className='flex gap-1 items-center'>
                            <MapPin className='h-4 w-4' />
                            <p className=' text-sm'>At</p>
                        </div>
                        <Badge variant={'outline'} className='text-sm h-6 font-semibold border-primary'>{props.post?.location}</Badge>
                    </div>
                )}
                <div className='mt-4'>
                    {props.post?.content}
                </div>
                {props.post?.imagesUrls && (
                    <div className={` grid grid-cols-1 ${props.post?.imagesUrls?.length == 1 && 'sm:grid-cols-1'} ${props.post?.imagesUrls?.length == 2 && 'sm:grid-cols-2'} ${props.post?.imagesUrls?.length == 3 && 'sm:grid-cols-3'} ${props.post?.imagesUrls?.length > 3 && 'sm:grid-cols-4'} gap-4 my-2 pr-4 items-center`}>
                        {props.post?.imagesUrls?.map((image: any, index: number) => (
                            <>
                                <div key={index} className={`mx-auto grid-cols-1 ${(index >= 3 && !pathname.includes('post')) && 'hidden'}`}>
                                    <Dialog>
                                        <DialogTrigger className='rounded-lg object-contain'>
                                            <img className='rounded-lg object-contain' src={image} alt={props.post?.author?.name} onClick={() => setCurrentIndex(index)}/>
                                        </DialogTrigger>
                                        
                                        <DialogContent className='px-0' >
                                            <DialogHeader className='px-6'>
                                                <p>Image {currentIndex + 1} of {props.post?.imagesUrls?.length}</p>
                                            </DialogHeader>
                                            <div className='flex justify-between gap-0'>
                                                <div className='w-10  flex justify-center items-center hover:cursor-pointer hover:bg-accent mx-2 rounded' onClick={handlePrevClick}>
                                                    <ChevronLeft className='h-9 w-9' />
                                                </div>
                                                <div className='w-full'>
                                                    <img className='rounded-lg object-contain' src={props.post?.imagesUrls[currentIndex]} alt={props.post?.author?.name} />
                                                </div>
                                                <div className='w-10  flex justify-center items-center hover:cursor-pointer hover:bg-accent mx-2 rounded' onClick={handleNextClick}>
                                                    <ChevronRight className='h-9 w-9' />
                                                </div>
                                            </div>
                                            
                                            

                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {(index == 4 && !pathname.includes('post')) && (
                                    <Link href={'/post/' + props.post?.id}>
                                        <div className='flex justify-center items-center h-14 bg-muted rounded-lg'>
                                            <p className='text-foreground'>+{props.post?.imagesUrls?.length - 4}</p>
                                        </div>
                                    </Link>
                                )}
                            </>
                        ))}
                    </div>

                )}
            </div>
        </div>
    }
}