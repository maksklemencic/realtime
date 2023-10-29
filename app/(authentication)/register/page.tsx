"use client"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiOutlineGoogle } from 'react-icons/ai'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'


const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100),
})

function RegisterPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false)
    const router = useRouter()
    const { data: session } = useSession();

    useEffect(() => {
		if (session) {
			router.push('/home')
		}
	}, [session])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        setIsLoading(true)
        toast.promise(
            axios.post('/api/auth/register', values),
            {
                loading: 'Creating account',
                success: (res) => {
                    setIsLoading(false)
                    router.push('/login');
                    return 'Account created successfully'
                },
                error: (err) => {
                    setIsLoading(false)
                    console.log(err)
                    return 'Account creation failed'
                }
            }
        );
    }

    function SocialActionGoogle() {
		setIsLoadingGoogle(true)

		signIn('google', {redirect: false}).then((res) => {
			if (res?.error) {
				toast.error(res.error)
			}
			if (res?.ok && !res?.error) {
				toast.success('Created new account')
			}
		}).catch((err) => {
			toast.error('Something went wrong')
		}
		).finally(() => setIsLoadingGoogle(false))
	}


    return (
        <div className="flex w-screen h-screen justify-center items-center bg-background">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className='min-w-[400px]'>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Create a new account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fullname</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <Button type="submit" className='w-full' disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className={`mr-2 h-4 w-4 animate-spin`} />
                                )}
                                Create account
                            </Button>

                            <div className="relative ">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-primary" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or register with
                                    </span>
                                </div>
                            </div>


                            <div className='mb-4 space-y-2'>
                                <Button variant="outline" type="button" disabled={isLoadingGoogle} className='w-full' onClick={() => SocialActionGoogle()}>
                                    {isLoadingGoogle ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <AiOutlineGoogle className="mr-2 h-4 w-4" />
                                    )}{" "}
                                    Google
                                </Button>
                            </div>

                        </CardContent>
                        <CardFooter className='flex flex-col gap-4'>

                            <div className='text-sm flex gap-1'>
                                <p>Already have an account?</p>
                                <Link href={"/login"} className='hover:underline text-primary font-semibold hover:cursor-pointer'>Log in</Link>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

export default RegisterPage