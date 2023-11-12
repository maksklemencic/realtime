"use client"

import { useTheme } from 'next-themes'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function ToasterContext() {
    const {theme} = useTheme()
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                style: {
                    background: theme === 'dark' ? '#1e283d' : "white",
                    border: theme === 'dark' ? '2px solid #18202e' : "black",
                    color: theme == "dark" ? '#fff' : "black",
                    marginTop: '64px',
                }
            }}
            
        />
    )
}

export default ToasterContext;