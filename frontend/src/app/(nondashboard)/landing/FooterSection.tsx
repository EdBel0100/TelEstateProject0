import React from 'react'
import Link from 'next/link'

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-20">
        <div className='max-w-4xl mx-auto px-6 sm:px-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='mb-4'>
                    <Link
                    href="/"
                    className="text-xl font-bold" 
                    scroll={false}>
                        Rentiful
                    </Link>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default FooterSection