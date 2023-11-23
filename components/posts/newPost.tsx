"use client"
import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import useAutosizeTextArea from '@/hooks/useAutoSizeTextArea';
import { AtSign, Image, LocateFixedIcon, MapPin, Smile, Users, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';
import { colors } from '@/lib/consts';
import { useUserData } from '@/context/userData';
import { Input } from '../ui/input';
import { uploadPicture } from '@/lib/imagekitApis';

export default function NewPost() {

    const router = useRouter()

    const [textContent, setTextContent] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, textContent);

    // const [groups, setGroups] = useState([])
    const { groups } = useUserData()

    const { data: session } = useSession();

    const searchParams = useSearchParams();
    const to = searchParams.get('to');

    const [selectedGroup, setSelectedGroup] = useState("")

    const [images, setImages] = useState<File[]>([])
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [location, setLocation] = useState('')
    const [inputLocation, setInputLocation] = useState(false)

    useEffect(() => {
        if (to) {
            if (to === "followers") {
                setSelectedGroup("followers")
            }
            else if (to !== '') {
                if (groups.find((group: any) => group.id === to)) {
                    setSelectedGroup(to)
                }
            }
        }
    }, [to, groups])

    const specialButtons = [
        {
            icon: <Image />,
            color: "bg-green-400",
            type: "image",
            label: "Image"
        },
        {
            icon: <LocateFixedIcon />,
            color: "bg-blue-400",
            type: "location",
            label: "Location"
        },
        // {
        //     icon: <Smile />,
        //     color: "bg-orange-400",
        //     type: "emoji",
        // },
        {
            icon: <AtSign />,
            color: "bg-red-400",
            type: "mention",
            label: "Mention"
        }
    ]

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setTextContent(val);
    };

    async function createNewPost() {

        if (textContent === "") {
            toast.error('Content should not be empty');
            return
        }


        let imageUrls: string[] = []
        if (images.length > 0) {
            toast.promise(
                Promise.all(images.map(async (image) => await saveImage(image))),
                {
                    loading: 'Uploading images ...',
                    success: (urls) => {
                        imageUrls = urls
                        createPost(imageUrls);
                        return 'All images uploaded!'
                    },
                    error: (err) => {
                        return err.message
                    },
                }
            );
        }
        else {
            createPost(imageUrls);
        }
        
    }

    function createPost(urls: string[]) {
        const body = {
            content: textContent,
            author: session?.user?.id,
            images: urls,
        }
        const body2 = {
            content: textContent,
            author: session?.user?.id,
            group: selectedGroup,
            images: urls,
        }

        toast.promise(
            fetch(`/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedGroup === "" ? body : body2),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        throw new Error('Content should not be empty')
                    }
                    else if (response.status === 500) {
                        throw new Error('Something went wrong')
                    }
                    else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    throw error;
                }),
            {
                loading: 'Posting ...',
                success: () => {
                    setTextContent("");
                    router.push('/home');
                    return 'New post created!'
                },
                error: (err) => {
                    setTextContent("");
                    return err.message
                },
            }
        );
    }

    async function saveImage(image: File) {
        const response = await uploadPicture('users/' + session?.user?.id + '/posts', image)

        const content = await response.json();
        if (!response?.ok) {
            toast.error('Error uploading images.');
            return null;
        }
        return content.url
    }

    function handleSpecialButtonClick(type: string) {
        if (type === "image") {
            handleImageUpload()
        }
        else if (type === "location") {
            handleLocationInput()

        }
    }

    function handleImageUpload() {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    }

    function handleLocationInput() {
        setInputLocation(!inputLocation)

    }


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // add images to the state. If the user selects multiple files, the files are stored in a FileList object
        // also if there are already images in the state, we need to add the new ones to the old ones
        // only images are allowed
        const imagesCount = images.length;
        let endCount = 0;
        const files = e.target.files;
        if (files) {
            const imagesArray = Array.from(files).filter((file) => file.type.match('image.*'));
            setImages([...images, ...imagesArray]);
            endCount = imagesCount + imagesArray.length;
        }
        if (endCount == imagesCount) {
            toast.error('No images selected');
        }
    };


    return (
        <div className='my-2'>
            <div className='h-10 my-2 flex justify-end items-center gap-4'>
                <p className='font-semibold'>Post to: </p>
                <Select defaultValue='followers' onValueChange={(e: string) => { setSelectedGroup(e) }}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select where to post" >
                            {(selectedGroup === "followers" || selectedGroup === '') && (
                                <div className={`flex items-center gap-2`}>
                                    <Users className='h-4 w-4' />
                                    <p>Followers</p>
                                </div>
                            )}
                            {selectedGroup !== "followers" && selectedGroup !== "" && (
                                <div className={`flex items-center gap-2`}>
                                    {groups.find((group: any) => group.id === selectedGroup)?.image === null && (
                                        <div className={`h-5 w-5 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>
                                    )}
                                    {groups.find((group: any) => group.id === selectedGroup)?.image !== null && colors.includes(groups.find((group: any) => group.id === selectedGroup)?.image) && (
                                        <div className={`h-5 w-5 rounded-lg ${groups.find((group: any) => group.id === selectedGroup)?.image}`}></div>
                                    )}
                                    {groups.find((group: any) => group.id === selectedGroup)?.image !== null && !colors.includes(groups.find((group: any) => group.id === selectedGroup)?.image) && (
                                        <img className='h-5 w-5 rounded-lg' src={groups.find((group: any) => group.id === selectedGroup)?.image} alt={groups.find((group: any) => group.id === selectedGroup)?.name} />
                                    )}
                                    <p>{groups.find((group: any) => group.id === selectedGroup)?.name}</p>
                                </div>

                            )}
                            {/* <p>{selectedGroup}</p> */}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className=''>
                        <SelectGroup>
                            <Link href={`/home/new/?to=followers`}>
                                <SelectItem className='hover:cursor-pointer' value="followers">Followers</SelectItem>
                            </Link>
                        </SelectGroup>
                        <Separator className='my-1' />
                        <SelectGroup>
                            <SelectLabel>Your groups</SelectLabel>
                            {groups.map((group: any, index) => (
                                <Link key={index} href={`/home/new/?to=${group?.id}`}>
                                    <SelectItem className='hover:cursor-pointer' value={group.id}>
                                        <div className='flex gap-4'>
                                            {group?.image === null && (
                                                <div className={`h-6 w-6 rounded-lg bg-muted border text-gray-white flex items-center justify-center`}><Users /></div>
                                            )}
                                            {group?.image !== null && colors.includes(group.image) && (
                                                <div className={`h-6 w-6 rounded-lg ${group.image}`}></div>
                                            )}
                                            {group?.image !== null && !colors.includes(group.image) && (
                                                <img className='h-6 w-6 rounded-lg' src={group?.image} alt={group?.name} />
                                            )}
                                            <p>{group.name}</p>
                                        </div>
                                    </SelectItem>
                                </Link>
                            ))}
                        </SelectGroup>

                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardContent className='p-4'>
                    {inputLocation && (
                        <>
                            <div className='p-2 flex gap-4'>
                                <div className='flex gap-2 items-center'>
                                    <MapPin className='h-4 w-4' />
                                    <p className='font-semibold text-sm'>At</p>
                                </div>
                                <Input className='w-full' placeholder='Location' value={location} onChange={(e: any) => setLocation(e.target.value)} />

                            </div>
                            <Separator className='my-1' />
                        </>
                    )}
                    <textarea
                        id="review-text"
                        onChange={handleChange}
                        placeholder="What would you like to share?"
                        ref={textAreaRef}
                        rows={1}
                        value={textContent}
                        className="resize-none outline-none border-none w-full p-2 bg-transparent"
                    />
                    <div className={`grid ${images?.length == 1 && 'grid-cols-1'} ${images?.length == 2 && 'grid-cols-2'} ${(images?.length > 2) && 'grid-cols-3'} gap-4 my-4 px-4 items-center`}>
                        {images?.map((image, index) => (
                            <div key={index} className='mx-auto  grid-cols-1 relative '>
                                <img className='object-contain' src={URL.createObjectURL(image)} alt={index.toString()} />
                                <div className='absolute right-1 top-1'>
                                    <Button size={'icon'} className='h-8 w-8' variant={'destructive'} onClick={() => setImages(images.filter((_, i) => i !== index))}>
                                        <X />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Separator className='mb-2' />
                    <div className='flex justify-between items-end p-2'>
                        <div className='flex gap-4 h-12'>
                            {specialButtons.map((button, index) => (
                                <div key={index} className='flex flex-col gap-2 items-center'>
                                    <p className='text-sm'>{button.label}</p>
                                    <button className={`${button.color} w-fit h-8 rounded-md px-3 py-1 text-white`} onClick={() => handleSpecialButtonClick(button.type)}>
                                        {button.icon}
                                    </button>

                                </div>
                            ))}
                        </div>
                        <Input
                            ref={imageInputRef}
                            type='file'
                            className='hidden'
                            accept='image/*'
                            onChange={handleImageChange}
                        />

                        <div className='flex justify-end'>
                            <Button className='h-8' onClick={() => createNewPost()}>Post</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}