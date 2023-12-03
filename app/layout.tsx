import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/providers/theme-provider"
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ToasterContext from '@/context/toaster'
import AuthContext from '@/context/auth'
import { User } from 'lucide-react'
import { UserDataProvider } from '@/context/userData'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Messenger app built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <UserDataProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
                <ToasterContext />
                {children}
            </ThemeProvider>
          </UserDataProvider>
        </AuthContext>
      </body>

    </html>
  )
}
