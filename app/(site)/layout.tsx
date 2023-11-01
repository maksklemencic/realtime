"use client"
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
                        <div className="w-full h-full bg-gray-50 dark:bg-background">
                            {children}
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