import { PageProps } from "@/types";
import ClientLayout from "@/Layouts/ClientLayout";
import { LucideMoveLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

export default function about({
    settings,
    categories,
    auth,
    products,
    totalCart,
    role,
    admin,
}: PageProps) {
    return (
        <div className="bg-gray-50 dark:bg-customDark2">
            <ClientLayout
                admin={admin}
                role={role}
                categories={categories}
                settings={settings}
                Products={products}
                auth={auth}
                totalCart={totalCart}
                header="Tentang Kami"
            >
                <div className="py-7">
                    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="#"
                                                onClick={() => router.get(route("welcome"))}
                                            >
                                                Beranda
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="#"
                                                onClick={() => router.get(route("about"))}
                                            >
                                                Tentang Kami
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="text-end">
                                <button
                                    onClick={() => window.history.back()}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-customDark rounded-full transition-colors"
                                >
                                    <LucideMoveLeft className="w-5 h-5 text-[var(--app-color)]" />
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className=" dark:bg-customDark2 p-6">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Tentang Kami
                                </h1>

                                <div className="space-y-8">
                                    {/* Company Vision */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Visi Kami
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Menjadi platform e-commerce terpercaya yang menghadirkan pengalaman berbelanja terbaik dengan mengutamakan kualitas produk dan kepuasan pelanggan.
                                        </p>
                                    </section>

                                    {/* Company Story */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Cerita Kami
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Didirikan pada tahun 2024, kami memulai perjalanan dengan tekad untuk memberikan solusi belanja online yang aman, nyaman, dan terpercaya. Dengan dukungan tim yang berpengalaman dan berkomitmen, kami terus berinovasi untuk menghadirkan layanan terbaik bagi pelanggan kami.
                                        </p>
                                    </section>

                                    {/* Values */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Nilai-Nilai Kami
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 bg-gray-50 dark:bg-customDark2 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                    Kepercayaan
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Kami menjunjung tinggi kejujuran dan transparansi dalam setiap transaksi.
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-customDark2 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                    Kualitas
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Kami berkomitmen untuk menyediakan produk berkualitas terbaik.
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-customDark2 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                    Inovasi
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Kami terus berinovasi untuk memberikan pengalaman berbelanja yang lebih baik.
                                                </p>
                                            </div>
                                        </div>
                                    </section>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ClientLayout>
        </div>
    );
}
