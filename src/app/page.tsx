'use client';

import useAuthStore from '@/store/user';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HomeDialog from '@/components/HomeDialog'
export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();
  if (!user?.email) {
    router.push("/login")
  }


  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 p-8">

      <main className="flex flex-col items-center gap-8">
        <h2 className="text-3xl font-bold">Welcome to CodeMember</h2>
        <HomeDialog backgroundUrl={String(user?.cover)} avatarUrl={String(user?.avatar)} title={String(user?.email)} />

        <div className='flex gap-4'>
          <Link className='px-2 py-1 bg-[#9992] rounded-lg shadow-lg font-bold text-sm' href={"/dashboard"}>Go Dashboard</Link>
          <Link className='px-2 py-1 bg-[#9992] rounded-lg shadow-lg font-bold text-sm' href={"/add"}>Add Data</Link>

        </div>
      </main>
    </div>
  );
}
