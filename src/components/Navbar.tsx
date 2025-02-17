"use client"

import Link from 'next/link';
import useAuthStore from '@/store/user';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <nav className="flex justify-between items-center flex-wrap p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold">CodeMember</h1>
      <div className="flex gap-4">


        {user?.email ? (
          <>
            <Link href="/dashboard" className="text-green-500 hover:underline">
              Dashboard
            </Link>
            <Link href="/add" className="text-blue-500 hover:underline">
              Add Data
            </Link>
            <Link href='/video' className="text-blue-500 hover:underline">Videos</Link>
            <Link href={'/image'} className="text-blue-500 hover:underline" >Images</Link>
            
          </>

        ) : (
          <>
            <Link href="/login" className="text-blue-500 hover:underline">  
               Login
            </Link>
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>

          </>
        )}
        <Link className="text-blue-500 hover:underline" href={'/'}>Home</Link>
      </div>
    </nav>
  );
}
