"use client"
import { useTheme } from "next-themes"

export default function Home() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="text-teal-300">
      <p>Home page</p>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle theme</button>
    </div>
  )
}
