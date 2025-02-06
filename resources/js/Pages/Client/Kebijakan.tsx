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

export default function Kebijakan({
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
                header="Kebijakan Privasi"
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
                                                onClick={() => router.get(route("privacy"))}
                                            >
                                                Kebijakan Privasi
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
                        <div className="dark:bg-customDark2 p-6">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Kebijakan Privasi
                                </h1>

                                <div className="space-y-8">
                                    {/* Information Collection */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Pengumpulan Informasi
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Kami mengumpulkan informasi yang Anda berikan saat membuat akun, melakukan pembelian, atau berkomunikasi dengan kami. Informasi ini mencakup nama, alamat email, nomor telepon, alamat pengiriman, dan detail pembayaran.
                                        </p>
                                    </section>

                                    {/* Data Usage */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Penggunaan Data
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Kami menggunakan informasi yang dikumpulkan untuk:
                                        </p>
                                        <div className="pl-6 space-y-2">
                                            <p className="text-gray-600 dark:text-gray-300">• Memproses pesanan dan pembayaran Anda</p>
                                            <p className="text-gray-600 dark:text-gray-300">• Mengirimkan pembaruan status pesanan</p>
                                            <p className="text-gray-600 dark:text-gray-300">• Memberikan dukungan pelanggan</p>
                                            <p className="text-gray-600 dark:text-gray-300">• Mengirimkan informasi promosi (dengan persetujuan)</p>
                                        </div>
                                    </section>

                                    {/* Data Protection */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Perlindungan Data
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Kami mengimplementasikan langkah-langkah keamanan yang tepat untuk melindungi informasi Anda dari akses yang tidak sah, perubahan, pengungkapan, atau penghancuran yang tidak sah.
                                        </p>
                                    </section>

                                    {/* Cookie Policy */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Kebijakan Cookie
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Kami menggunakan cookie untuk meningkatkan pengalaman pengguna Anda. Cookie membantu kami memahami bagaimana pengunjung berinteraksi dengan situs web kami dan memungkinkan kami menyimpan preferensi Anda.
                                        </p>
                                    </section>

                                    {/* User Rights */}
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            Hak Pengguna
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 bg-gray-50 dark:bg-customDark2 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                    Akses Data
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Anda berhak mengakses data pribadi Anda yang kami simpan.
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-customDark2 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                    Koreksi Data
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Anda dapat meminta pembaruan atau koreksi data Anda.
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-customDark2 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                    Hapus Data
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Anda dapat meminta penghapusan data pribadi Anda.
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
