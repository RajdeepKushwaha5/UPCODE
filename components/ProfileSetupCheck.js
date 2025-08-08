"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProfileSetupCheck({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfileSetup = async () => {
      // Skip check for certain pages
      const skipPages = ['/login', '/register', '/setup-profile', '/', '/contests'];
      if (skipPages.includes(pathname) || status !== 'authenticated') {
        return;
      }

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();

          // Redirect to profile setup if needed
          if (data.user.needsProfileSetup && pathname !== '/setup-profile') {
            router.push('/setup-profile');
          }
        }
      } catch (error) {
        console.error('Error checking profile setup:', error);
      }
    };

    if (status === 'authenticated') {
      checkProfileSetup();
    }
  }, [session, status, pathname, router]);

  return children;
}
