import { EmptyStateProps } from '@/types'
import Image from 'next/image'
import React from 'react'

const EmptyState = ({ title, search, buttonLink, buttonText }: EmptyStateProps) => {
    return (
        <section className='flex-center size-full flex-col gap-3'>
            <Image
                src='/icons/emptyState.svg'
                alt='empty state icon'
                width={250}
                height={250}
            />
            <div className='flex-center w-full max-w-[254px] flex-col gap-3'>
                <h1 className="text-16 text-center">{title}</h1>
            </div>
        </section>
    )
}

export default EmptyState
