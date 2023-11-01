"use client"
import BreadCrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar"
import { Sidebar } from "@/components/sidebar";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { status } = useSession();
    return (
        <>
            {status === 'authenticated' && (
                <div className="w-screen h-screen bg-background flex flex-col">
                    <div className="w-full">
                        <Navbar />
                    </div>
                    <div className="flex flex-col-reverse md:flex-row h-full w-full">
                        <Sidebar />
                        <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-background">
                            <BreadCrumb />
                            <div className='w-full h-full grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
                                <div className='col-span-4 lg:col-span-4 xl:col-span-5 h-full'>
                                    {children}
                                </div>
                                <div className="hidden lg:block col-span-2 "/>
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
            {status === 'unauthenticated' && (
                <>
                    {children}
                </>
            )}
        </>
    );

}