"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AiOutlineGoogle } from 'react-icons/ai'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export default function LoginPage() {

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);

	const { data: session } = useSession();
	const router = useRouter()

	useEffect(() => {
		if (session) {
			router.push('/home')
		}
	}, [session])


	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {

		setIsLoading(true)

		signIn('credentials', {
			...values,
			redirect: false,
		}).then((res) => {
			if (res?.error) {
				toast.error(res.error)
			}
			if (res?.ok && !res?.error) {
				toast.success('Logged in successfully')
			}
		}).catch((err) => {
			toast.error('Something went wrong')
		}).finally(() => setIsLoading(false))

	}

	function SocialActionGoogle() {
		setIsLoadingGoogle(true)

		signIn('google', { redirect: false }).then((res) => {
			if (res?.error) {
				toast.error(res.error)
			}
			if (res?.ok && !res?.error) {
				toast.success('Logged in successfully')
			}
		}).catch((err) => {
			toast.error('Something went wrong')
		}
		).finally(() => setIsLoadingGoogle(false))
	}

	return (
		<>
			{/* {session && ( */}
				<div className="flex w-screen h-screen justify-center items-center bg-background">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Card className='min-w-[400px]'>
								<CardHeader>
									<CardTitle>Log In</CardTitle>
									<CardDescription>
										Authenticate with an existing account
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div >

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input  {...field} type="email" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<Input  {...field} type="password" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

									</div>
									<Button type="submit" className='w-full' disabled={isLoading}>
										{isLoading && (
											<Loader2 className={`mr-2 h-4 w-4 animate-spin`} />
										)}
										Login
									</Button>

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t border-primary" />
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-background px-2 text-muted-foreground">
												Or continue with
											</span>
										</div>
									</div>

									<div className='space-y-2'>
										<Button variant="outline" type="button" disabled={isLoadingGoogle} onClick={() => SocialActionGoogle()} className='w-full'>
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
										<p>Don't have an account yet?</p>
										<Link href={"/register"} className='hover:underline text-primary font-semibold hover:cursor-pointer'>Create account</Link>
									</div>
								</CardFooter>
							</Card>
						</form>
					</Form>
				</div>
			{/* )} */}
		</>
	)
}
