import React, { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import {
    ShoppingCart,
    User,
    Search,
    Menu,
    X
} from 'lucide-react';
import { Input } from '@/Components/ui/input';

interface settings {
    key: string;
    value: string;
    type: string;
}

interface Category {
    id: number;
    name: string;
    image: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    phone: string;
    address: string;
    email_verified_at?: string;
}

interface HeaderProps {
    settings: settings[];
    categories: Category[];
    auth: {
        user: User;
    };
}

export default function Header({ settings, categories, auth }: HeaderProps) {
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

        const [event, setEvent] = useState('');
        const [eventLink, setEventLink] = useState('');

        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

        const toggleMobileMenu = () => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        };

        useEffect(() => {
            settings.forEach((setting) => {
                if (setting.key === "web_event") {
                    setEvent(setting.value);
                }
                if (setting.key === "web_event_link") {
                    setEventLink(setting.value);
                }
            });
        }, [])

  return (
    <>
         {
                event && <div className="bg-[--app-color] text-white text-center py-2 text-sm">
                    <a href={eventLink} className='cursor-pointer hover:underline' target='_blank'>
                    {event}
                    </a>
                </div>
            }

                <header className="bg-white shadow-md">
                    <div className="container mx-auto px-4 py-4 hidden md:flex justify-between items-center">
                        <Link href={"/"} className="text-[var(--app-color)] text-2xl font-bold">
                            {appName}
                        </Link>

                        <div className="flex-grow mx-8 max-w-xl">
                            <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="w-full px-4 py-4 border rounded-full"
                            />
                                <button className="absolute right-2 top-2.5">
                                    <Search size={20} className="hover:text-[var(--app-color)] text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-5">
                            {auth.user ? (
                                <>
                                <button className="hover:text-[var(--app-color)] relative ">
                                    <ShoppingCart size={24} />
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                        0
                                    </span>
                                </button>

                              <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                <Avatar className='w-10 h-10'>
                                                    {
                                                        auth.user.image &&
                                                        <AvatarImage src={"/"+ auth.user.image} className='object-cover' />
                                                    }
                                                    <AvatarFallback>{auth.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('user.profile')}
                                        >
                                            Profile
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

                                </>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={route('register')}
                                        className="hover:text-[var(--app-color)]"
                                    >
                                        Daftar
                                    </Link>
                                    <div>|</div>
                                    <Link
                                        href={route('login')}
                                        className="hover:text-[var(--app-color)]"
                                    >
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <div className="flex justify-between items-center p-4">
                            <div className="themeColor text-2xl font-bold ">
                                {appName}
                            </div>
                            <button onClick={toggleMobileMenu}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {isMobileMenuOpen && (
                            <div className="absolute z-50 w-full bg-white shadow-lg">
                                <div className="p-4">
                                    <div className="relative mb-4">
                                        <Input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full px-4 py-2 border rounded-full"
                                        />
                                        <button className="absolute right-2 top-2.5">
                                            <Search size={20} className="text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        {auth.user ? (
                                            <div className="flex space-x-4">
                                                <Link href={route('dashboard')}>
                                                    <User size={24} />
                                                </Link>

                                                <button className="relative">
                                                    <ShoppingCart size={24} />
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                                        0
                                                    </span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('register')}
                                                    className="hover:text-[var(--app-color)]"
                                                >
                                                    Daftar
                                                </Link>
                                                <div>|</div>
                                                <Link
                                                    href={route('login')}
                                                    className="hover:text-[var(--app-color)]"
                                                >
                                                    Login
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <nav className="bg-gray-100">
                                    <div className="flex flex-col">
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/category/${category.id}`}
                                                className="themeHover text-gray-700 transition p-4 border-b"
                                            >
                                                {category.name}
                                            </Link>
                                        )).slice(0, 5)}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Desktop Category Navigation */}
                    <nav className="bg-gray-100 py-3 hidden md:block">
                        <div className="container mx-auto px-4 flex justify-center space-x-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.id}`}
                                    className="text-gray-700 hover:text-[var(--app-color)] transition"
                                >
                                    {category.name}
                                </Link>
                            )).slice(0, 5)}
                        </div>
                    </nav>
                </header>
    </>
  )
}
