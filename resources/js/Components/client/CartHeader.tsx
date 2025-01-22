import React, { useState, useEffect } from "react";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { settings, Category, User } from "@/types";
import DarkModeToggle from "../DarkModeToggle";
import { ShoppingCart, User2, Search, Menu, X } from "lucide-react";
import { router } from "@inertiajs/react";

interface HeaderProps {
    settings: settings[];
    categories: Category[];
    auth: {
        user: User;
    };
    totalCart: number;
    role: string;
}

export default function CartHeader({
    settings,
    categories,
    auth,
    totalCart,
    role
}: HeaderProps) {
    const appName = import.meta.env.VITE_APP_NAME || "Laravel";

    const [event, setEvent] = useState("");
    const [eventLink, setEventLink] = useState("");
    const [eventMovingText, setEventMovingText] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [params, setParams] = useState<string>("");

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
            if(setting.key === "web_event_moving"){
                setEventMovingText(setting.value == "1" ? true : false);
            }
        });

        const currentUrl: string = window.location.href;
        const url: URL = new URL(currentUrl);
        if (url.pathname === "/cart-search") {
            const params: URLSearchParams = new URLSearchParams(url.search);
            const keyword: string | null = params.get("q");
            if (keyword) {
                setParams(keyword);
            }
        }
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route("cart.search"), { q: searchTerm });
    };

    useEffect(() => {
        const searchBar: NodeListOf<HTMLInputElement> =
            document.querySelectorAll("input[type='search']");
        searchBar.forEach((e) => {
            e.value = params;
        });
    }, [params]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    return (
        <>
            {event && (
                <div className="bg-[--app-color]  mt-0.5  text-white text-center py-2 max-h-9 min-h-9 text-sm">
                     {
                    eventMovingText ? <div dangerouslySetInnerHTML={{ __html:
                    `<marquee>
                    <a
                        href=${eventLink}
                        target="_blank"
                        className="hover:underline"
                    >
                        ${event}
                    </a></marquee>` }} /> :
                        <a
                        href={eventLink}
                        target="_blank"
                        className="hover:underline"
                    >
                        {event}
                    </a>
                }
                </div>
            )}

            <header className="bg-white dark:bg-customDark shadow-md">
                <div className="container mx-auto px-4 py-4 hidden md:flex justify-between items-center">
                    <Link
                        href={"/"}
                        className="text-[var(--app-color)] text-2xl font-bold flex items-center"
                    >
                        <img
                            src="/favicon.ico"
                            alt="favicon"
                            className="w-8 h-8 inline-block mr-2"
                        />
                        {appName}
                    </Link>

                    <div className="flex-grow mx-8 max-w-xl">
                        <div className="relative">
                            <form onSubmit={handleSearch}>
                                <Input
                                    type="search"
                                    placeholder="Search cart item..."
                                    className="w-full px-4 py-4 border rounded-full searchBar"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2.5"
                                >
                                    <Search
                                        size={20}
                                        className="hover:text-[var(--app-color)] text-gray-500"
                                    />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center space-x-5">
                        <>
                            <DarkModeToggle />

                            <button
                                onClick={() => {
                                    router.get(route("cart.index"));
                                }}
                                className="hover:text-[var(--app-color)] relative "
                            >
                                <ShoppingCart size={24} />
                                {totalCart > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                        {totalCart}
                                    </span>
                                )}
                            </button>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-customDark text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            <Avatar className="w-10 h-10">
                                                {auth.user.image &&
                                                auth.user.image.includes(
                                                    "storage"
                                                ) ? (
                                                    <AvatarImage
                                                        src={
                                                            "/" +
                                                            auth.user.image
                                                        }
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <AvatarImage
                                                        src={auth.user.image}
                                                        className="object-cover"
                                                    />
                                                )}
                                                <AvatarFallback>
                                                    {auth.user.name
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("user.profile")}>
                                        Profile
                                    </Dropdown.Link>
                                    {
                                        role === "admin" ? (
                                            <Dropdown.Link
                                                href={route("dashboard")}
                                            >
                                                Admin
                                            </Dropdown.Link>
                                        ) : ""
                                    }
                                     <Dropdown.Link
                                        href={route('order.history')}
                                    >
                                        Order History
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <div className="flex justify-between items-center p-4">
                        <div className="themeColor text-2xl font-bold ">
                            {appName}
                        </div>
                        <button onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
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
                                        <Search
                                            size={20}
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex space-x-4">
                                        <Link href={route("dashboard")}>
                                            <User2 size={24} />
                                        </Link>

                                        <button className="relative">
                                            <ShoppingCart size={24} />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                                0
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <nav className="bg-gray-100">
                                <div className="flex flex-col">
                                    {categories
                                        .map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/category/${category.name.replace(/\s+/g, "-")}`}
                                                className="themeHover text-gray-700 transition p-4 border-b"
                                            >
                                                {category.name}
                                            </Link>
                                        ))
                                        .slice(0, 5)}
                                </div>
                            </nav>
                        </div>
                    )}
                </div>

                {/* Desktop Category Navigation */}
                {/* <nav className="bg-gray-100 py-3 hidden md:block">
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
                    </nav> */}
            </header>
        </>
    );
}
