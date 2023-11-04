
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/dist/client/components/navigation'
import React from 'react'

async function SearchPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
          redirect('/login')
        }
      })

    return (
        <div className='w-full h-full'>SearchPage</div>
    )
}

export default SearchPage