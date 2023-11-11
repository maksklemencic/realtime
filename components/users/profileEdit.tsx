"use client"
import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Skeleton } from '../ui/skeleton'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


export default function ProfileEdit() {

    const { data: session } = useSession()
    const [editUser, setEditUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/users/${session?.user?.id}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setEditUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    }, [])

    function formatDateAndTime(date: string) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
        return new Date(date).toLocaleDateString('de-DE', options);
    }

    function handleEdit() {
        toast.promise(
            fetch(`/api/users/${session?.user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editUser?.name,
                    image: editUser?.image,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else if (response.status === 500) {
                        throw new Error('Something went wrong')
                    }
                    throw new Error('Network response was not ok');
                })
                .then((data) => {
                })
                .catch((error) => {
                    console.error('Error updating user:', error);
                }), {
            
            loading: 'Saving...',
            success: () => {
                router.push('/users/' + session?.user?.id);
                return 'User updated!'
            },
            error: 'Error updating the user.',
        })
    }
    
    return (
        <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
            <Card >
                <CardContent className='px-0 '>
                    <div className='relative'>
                        <AspectRatio ratio={5 / 1} >
                            <Image
                                src="https://images.unsplash.com/photo-1517315003714-a071486bd9ea?auto=format&fit=crop&q=80&w=1171&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Photo by Drew Beamer"
                                className="rounded-t-md object-cover"
                                fill
                            />
                        </AspectRatio>
                        <div className='absolute left-6 -bottom-6'>
                            {loading ? (
                                <Skeleton className='h-16 w-16 rounded-lg' />
                            ) : (
                                <Avatar className=" h-16 w-16 rounded-lg">
                                    <AvatarImage src={editUser?.image} />
                                    <AvatarFallback className=' h-16 w-16 rounded-lg bg-background border'><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>
                    <div className='mt-10 px-6'>
                        {loading ? (
                            <Skeleton className='h-4 w-full ' />
                        ) : (
                            <Input className='mt-2' placeholder='Name' value={editUser?.name} onChange={(e: any) => setEditUser({ ...editUser, name: e.target.value })}/>
                        )}
                    </div>
                    <div className=' px-6 mt-4'>
                        {loading ? (
                            <Skeleton className='h-4 w-48 mt-2' />
                        ) : (
                            <p className='text-sm text-gray-500'>{editUser?.email}</p>
                        )}
                    </div>

                </CardContent>
                <CardFooter className='flex justify-between'>
                    <div className='flex gap-2 text-sm'>
                        <p className='text-gray-400'>Last updated at: </p>
                        {loading ? (
                            <Skeleton className='h-5 w-32' />
                        ) : (
                            <p>{formatDateAndTime(editUser?.updatedAt)}</p>
                        )}
                    </div>
                    <Button className='h-8' onClick={() => handleEdit()}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
