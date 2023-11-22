"use client"
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { uploadProfilePicture } from '@/lib/imagekitApis'


export default function ChatPage() {

    const { data: session } = useSession()

  
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };


    return (
        <div className=' space-y-4 mb-4 '>


            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={() => uploadProfilePicture(session?.user?.id, file!)}>Upload</button>
            </div>

        </div >
    )
}