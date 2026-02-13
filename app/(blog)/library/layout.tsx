'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader } from 'lucide-react';

interface LibraryLayoutProps {
    children: React.ReactNode;
}

export default function LibraryLayout({ children }: LibraryLayoutProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        if (!isLoading && !user) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [user, isLoading, router, pathname]);

    if (isLoading || !user) {
        return (
             <div className="flex min-h-screen items-center justify-center text-cyan-400">
                <Loader className="animate-spin mr-3" size={24} />
                Checking access permissions...
             </div>
        );
    }

    return children;
}