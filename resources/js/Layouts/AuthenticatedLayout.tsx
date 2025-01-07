import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect, createContext } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar"
import { AppSidebar } from '@/Components/AppSidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Toaster } from 'sonner'
import DarkModeToggle from '@/Components/DarkModeToggle';

interface AdminContextType {
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export default function Authenticated({
    header,
    children,

}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <AdminContext.Provider value={{isSidebarCollapsed, setIsSidebarCollapsed}}>
            <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-gray-100">
                <nav className="fixed z-40 w-screen border-b border-gray-100 bg-white dark:bg-slate-950">
                    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-end">
                            <div className="sm:ms-6 sm:flex sm:items-center">
                                {/* <DarkModeToggle/> */}

                                <div className="relative ms-3 mt-2 md:mt-0">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    <Avatar className='mx-2 w-7 h-7'>
                                                        {
                                                            user.image &&
                                                            <AvatarImage src={`/${user.image}`} className='object-cover' />
                                                        }
                                                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>

                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('welcome')}
                                            >
                                                Store Page
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            <SidebarProvider>
            <AppSidebar />
                <main> <SidebarTrigger className='fixed top-5 z-50' />
                    <div className={`mt-10 w-[100vw] transition-all ${isSidebarCollapsed ? "md:w-[calc(100vw-70px)]  duration-300" : "md:w-[calc(100vw-280px)]"} `}>
                        {children}
                        <Toaster richColors position="top-right"/>
                    </div>
                </main>
            </SidebarProvider>
            </div>
        </AdminContext.Provider>
    );
}
