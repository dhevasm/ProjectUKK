
import { settings, Category, Product, User } from "@/types";
import Header from "@/Components/client/Header";
import Footer from "@/Components/client/Footer";
import { Head } from "@inertiajs/react";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

interface PropsType {
    categories: Category[];
    settings: settings[];
    Products: Product[];
    auth: {
        user: User;
    };
    totalCart: number;
    header: string;
    children: React.ReactNode;
    role: string;
}


export default function ClientLayout({
    categories,
    settings,
    Products,
    auth,
    totalCart,
    header,
    children,
    role,
}: PropsType) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);
  return (
    <>
        <Header role={role} settings={settings} totalCart={totalCart} categories={categories} auth={auth} products={Products} />
        <Head title={header} />
        {children}
        <Toaster richColors position="top-right" theme={theme} />
        <Footer settings={settings} />
    </>
  )
}
