import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

export default function Guest({ children }: PropsWithChildren) {
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

     useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
            <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-customDark2 pt-6 sm:justify-center sm:pt-0">
                <div className="mt-6 w-full overflow-hidden bg-white dark:bg-customDark px-6 py-5 shadow-md sm:max-w-md sm:rounded-lg">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        {children}
                        <Toaster richColors position="top-right" theme={theme} />
                    </GoogleOAuthProvider>
                </div>
            </div>

    );
}
