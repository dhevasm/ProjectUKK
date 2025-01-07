import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
    const appColor = import.meta.env.VITE_APP_COLOR || '#3b82f6';
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <h1>{appName}</h1>
                </Link>
            </div>
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-5 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
