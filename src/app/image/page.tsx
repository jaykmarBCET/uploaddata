'use client';

import useAuthStore from '@/store/user';
import React, { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function ImagePage() {
    const { data, user } = useAuthStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false); // Prevent SSR hydration issues

    // Ensure 'isMounted' is set only after the component mounts
    useEffect(() => {
        setIsMounted(true);

        if (!user) {
            router.replace("/login"); // Use replace() to prevent back navigation issues
        }
    }, [user, router]);

    // Ensure 'data' is properly filtered
    const images = useMemo(() => data?.filter((item) => item.type !== "video") || [], [data]);

    // Return 'null' only after all hooks are called
    if (!isMounted) return null;

    return (
        <div>
            {images.length > 0 ? (
                <div className='flex gap-2 shadow-lg mt-10 justify-center items-center flex-wrap  min-w-screen min-h-screen'>
                    {images.map((item) => (
                        <div key={item.dataId} className=''>
                            <Image className='hover:scale-105 shadow border object-fill'
                                src={item.dataUrl} 
                                height={300} 
                                width={300} 
                                alt="image"
                                unoptimized // Add if images are from an external source
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div>No images available</div>
            )}
        </div>
    );
}

export default ImagePage;
