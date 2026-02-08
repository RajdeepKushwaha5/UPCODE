import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-[70vh] flex flex-col justify-center items-center' style={{ backgroundColor: 'var(--bg-primary)' }}>
      <h1 className='text-7xl font-bold mb-12' style={{ color: 'var(--text-primary)' }}>
        404 | Page not found
      </h1>
      <Link href='/' className='py-3 px-6 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300' style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
        Back to Home
      </Link>
    </div>
  )
}

export default page