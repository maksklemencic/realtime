"use client"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })

  return (
    <div className={`w-full h-full bg-blue-200`}>
          <p>Home page</p>
    </div>
  )
}
