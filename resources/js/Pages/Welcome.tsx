import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Home from './Client/Home';
import Footer from '@/Components/client/Footer';
import Header from '@/Components/client/Header';

export default function Welcome({auth, settings, categories, products}: PageProps) {
    return (
        <>
            <Head title="E-commerce" />
            <div className="bg-white min-h-screen flex flex-col">
                <Header settings={settings} categories={categories} auth={auth} />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Home settings={settings} categories={categories} products={products} />

                    </main>
             <Footer settings={settings} />
            </div>
        </>
    );
}
