"use client"
import BreadCrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar"
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })
    return (
        <>
            {status === 'authenticated' && (
                <div className="w-screen h-screen bg-background flex flex-col ">
                    <div className="w-full">
                        <Navbar />
                    </div>
                    <div className="flex flex-col-reverse md:flex-row w-full h-[calc(100%-64px)]">

                        <Sidebar />

                        <div className="w-full md:h-full h-[calc(100%-64px)] flex flex-col">
                            <div className="h-14">
                                <BreadCrumb />
                            </div>
                            
                            <div className='w-full h-[calc(100%-56px)] grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 '>
                                <ScrollArea className='col-span-4 lg:col-span-4 xl:col-span-6 h-[calc(100%)]'>
                                    {children}
                                </ScrollArea>
                                <div className="hidden lg:block col-span-1" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {status === 'loading' && (
                <div className="w-screen h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
            )}
            {status !== 'authenticated' && status !== "loading" && (
                <>
                    {children}
                </>
            )}
        </>
    );

}