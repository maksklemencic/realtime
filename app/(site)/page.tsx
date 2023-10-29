"use client"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  return (
    <div className="text-teal-300">
      <p>Home page</p>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle theme</button>
      {session ? (
        <>
          <p>Logged in as {session!.user?.email} - {session.user?.name}</p>
          <img src={session.user?.image!} className="h-32 w-32" alt="" />
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
          <Link href="/login" >
            <p>Login</p>
          </Link>
      )}

    </div>
  )
}
