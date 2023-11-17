"use client"
import React from 'react'
import DisplayGroups from '@/components/groups/displayGroups'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function GroupsPage() {

  return (
    <div className='mx-6 md:mx-16 xl:mx-32 2xl:mx-56'>
      <div className='flex w-full justify-end'>
        <Link href='/groups/new'>
          <Button className='h-8 flex gap-1 mr-2'>
            <PlusCircle className='h-5 w-5' />
            <p className='hidden xs:block'>New group</p>
          </Button>
        </Link>
      </div>
      <Separator className='mt-4 mb-2' />
      <DisplayGroups />
    </div >
  )
}