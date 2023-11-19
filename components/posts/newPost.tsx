"use client"
import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import useAutosizeTextArea from '@/hooks/useAutoSizeTextArea';
import { AtSign, Image, LocateFixedIcon, Smile, Users } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';
import { colors } from '@/lib/consts';
import { useUserData } from '@/context/userData';

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
        },
        {
            icon: <LocateFixedIcon />,
            color: "bg-blue-400",
        },
        {
            icon: <Smile />,
            color: "bg-orange-400",
        },
        {
            icon: <AtSign />,
            color: "bg-red-400",
        }
    ]

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setTextContent(val);
    };

    function createNewPost() {

        const body = {
            content: textContent,
            author: session?.user?.id
        }
        const body2 = {
            content: textContent,
            author: session?.user?.id,
            group: selectedGroup
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


    return (
        <div className='my-2'>
            <div className='h-10 my-2 flex justify-end items-center gap-4'>
                <p className='font-semibold'>Post to: </p>
                <Select defaultValue='followers' onValueChange={(e: string) => {setSelectedGroup(e)}}>
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
                <CardContent className='p-2'>
                    <textarea
                        id="review-text"
                        onChange={handleChange}
                        placeholder="What would you like to share?"
                        ref={textAreaRef}
                        rows={1}
                        value={textContent}
                        className="resize-none outline-none border-none w-full p-2 bg-transparent"
                    />
                    <Separator className='mb-2' />
                    <div className='flex justify-between p-2'>
                        <div className='flex gap-2 h-8'>
                            {specialButtons.map((button, index) => (
                                <button key={index} className={`${button.color} rounded-md px-2 py-1 text-white`}>
                                    {button.icon}
                                </button>
                            ))}
                        </div>
                        <div className='flex justify-end'>
                            <Button className='h-8' onClick={() => createNewPost()}>Post</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}