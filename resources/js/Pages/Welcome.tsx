import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Home from './Client/Home';
import Footer from '@/Components/client/Footer';
import Header from '@/Components/client/Header';

export default function Welcome({auth, settings, categories, products, totalCart, role, admin}: PageProps) {
    return (
        <>
            <Head title="E-commerce" />
            <div className="bg-gray-50 dark:bg-customDark2 min-h-screen flex flex-col">
                <Header settings={settings} categories={categories} auth={auth} products={products} totalCart={totalCart} role={role} />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {
                            auth.user && auth.user.email_verified_at === null ? (
                                <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 p-4 rounded-md mb-4">
                                    Your email is not verified. Please Check your email to verify and get full access to your account.
                                </div>
                            ) : null
                        }
                        <Home settings={settings} categories={categories} products={products} />
                    </main>
                <Footer settings={settings} admin={admin} />
            </div>
        </>
    );
}
