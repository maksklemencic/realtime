
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/dist/client/components/navigation'
import React from 'react'

async function SearchPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return (
        <div>SearchPage</div>
    )
}

export default SearchPage