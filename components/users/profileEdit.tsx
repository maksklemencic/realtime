"use client"
import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { File, FileImage, FileX, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Skeleton } from '../ui/skeleton'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { formatDateAndTime } from '@/lib/consts'
import { Badge } from '../ui/badge'
import { Label } from '@radix-ui/react-label'
import { uploadProfilePicture } from '@/lib/imagekitApis'

export default function ProfileEdit() {

    const { data: session } = useSession()

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editUser, setEditUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);

    const [file, setFile] = React.useState<File | null>(null);

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

    async function handleEdit() {
        let url = editUser?.image;
        if (file) {
            const response = await uploadProfilePicture(session?.user?.id, file!);
        
            const content = await response.json();
            if (!response?.ok) {
                toast.error('Error uploading the image.');
                return;
            }

            url = content.url;
        }
        toast.promise(
            fetch(`/api/users/${session?.user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editUser?.name,
                    image: url,
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


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

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
                    </div>

                    <div className='flex flex-row items-end mt-6 gap-4 px-6'>
                        {loading ? (
                            <Skeleton className='h-20 w-20 rounded-lg' />
                        ) : (
                            <div className='flex gap-4 items-end'>
                                {file ? (
                                    <Avatar className=" h-20 w-20 rounded-lg">
                                        <AvatarImage src={URL.createObjectURL(file)} />
                                        <AvatarFallback className=' h-20 w-20 rounded-lg bg-background border'><User /></AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <Avatar className=" h-20 w-20 rounded-lg">
                                        <AvatarImage src={editUser?.image} />
                                        <AvatarFallback className=' h-20 w-20 rounded-lg bg-background border'><User /></AvatarFallback>
                                    </Avatar>
                                )}

                                <div className="relative">
                                    <div className={`flex h-20 justify-between ${file ? 'flex-col' : 'flex-col-reverse'}`}>

                                        {file && (
                                            <Badge className=''>
                                                {file.name}
                                            </Badge>
                                        )}
                                        <div className='flex gap-4'>
                                            <Button onClick={handleButtonClick} variant={"outline"} className='h-8 flex gap-2 w-fit'>
                                                <FileImage className='h-4 w-4' />
                                                {file ? 'Change' : 'Upload'}
                                            </Button>
                                            {file && (
                                                <Button variant={"destructive"} className='h-8 flex gap-2 w-fit' onClick={() => setFile(null)}>
                                                    <FileX className='h-4 w-4' />
                                                    Remove
                                                </Button>
                                            )}

                                        </div>

                                    </div>

                                    <Input
                                        ref={fileInputRef}
                                        type='file'
                                        className='hidden'
                                        onChange={handleFileChange}
                                    />

                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-row items-end mt-6 gap-4 px-6'>
                        <div className='w-full'>
                            {loading ? (
                                <Skeleton className='h-4 w-full ' />
                            ) : (
                                <>
                                    <Label className='text-sm text-gray-500'>Name</Label>
                                    <Input className='mt-2' placeholder='Name' value={editUser?.name} onChange={(e: any) => {setEditUser({ ...editUser, name: e.target.value })}} />
                                </>
                            )}
                        </div>

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
                    <div className='space-x-4'>
                        <Button className='h-8' variant={'destructive'} onClick={() => router.push('/users/' + session?.user?.id)}>Cancel</Button>
                        <Button className='h-8' onClick={() => handleEdit()}>Save</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
