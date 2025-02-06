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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

export default function Help({
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
                header="Bantuan"
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
                                                onClick={() =>
                                                    router.get(route("welcome"))
                                                }
                                            >
                                                Beranda
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="#"
                                                onClick={() =>
                                                    router.get(route("help"))
                                                }
                                            >
                                                Bantuan
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
                                    Bantuan
                                </h1>

                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full space-y-2"
                                >
                                    <AccordionItem
                                        value="account"
                                        className="border rounded-lg"
                                    >
                                        <AccordionTrigger className="px-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                                            Register & Login
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Cara Mendaftar:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Klik tombol "Daftar"
                                                            di pojok kanan atas
                                                        </li>
                                                        <li>
                                                            Isi nama lengkap
                                                            sesuai identitas
                                                        </li>
                                                        <li>
                                                            Masukkan alamat
                                                            email aktif
                                                        </li>
                                                        <li>
                                                            Buat password
                                                            minimal 8 karakter
                                                            (kombinasi huruf dan
                                                            angka)
                                                        </li>
                                                        <li>
                                                            Masukkan nomor
                                                            telepon aktif
                                                        </li>
                                                        <li>
                                                            Centang persetujuan
                                                            syarat dan ketentuan
                                                        </li>
                                                        <li>
                                                            Klik tombol "Daftar"
                                                        </li>
                                                        <li>
                                                            Cek email untuk
                                                            verifikasi akun
                                                        </li>
                                                    </ol>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Cara Login:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Klik "Masuk" di
                                                            pojok kanan atas
                                                        </li>
                                                        <li>
                                                            Masukkan email yang
                                                            sudah terdaftar
                                                        </li>
                                                        <li>
                                                            Masukkan password
                                                        </li>
                                                        <li>
                                                            Klik "Ingat Saya"
                                                            jika ingin tetap
                                                            login
                                                        </li>
                                                        <li>
                                                            Tekan tombol "Masuk"
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem
                                        value="cart"
                                        className="border rounded-lg"
                                    >
                                        <AccordionTrigger className="px-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                                            Keranjang & Checkout
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Mengelola Keranjang:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Pilih produk yang
                                                            ingin dibeli
                                                        </li>
                                                        <li>
                                                            Tentukan variasi
                                                            produk (jika
                                                            tersedia)
                                                        </li>
                                                        <li>
                                                            Atur jumlah yang
                                                            diinginkan
                                                        </li>
                                                        <li>
                                                            Klik "Tambah ke
                                                            Keranjang"
                                                        </li>
                                                        <li>
                                                            Di halaman
                                                            keranjang, Anda
                                                            dapat:
                                                            <ul className="list-disc pl-5 mt-1">
                                                                <li>
                                                                    Mengubah
                                                                    jumlah
                                                                    produk
                                                                </li>
                                                                <li>
                                                                    Menghapus
                                                                    produk
                                                                </li>
                                                                <li>
                                                                    Memilih/uncheck
                                                                    produk
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ol>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Proses Checkout:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Pastikan produk yang
                                                            akan dibeli sudah
                                                            tercentang
                                                        </li>
                                                        <li>
                                                            Klik tombol
                                                            "Checkout"
                                                        </li>
                                                        <li>
                                                            Pilih atau tambah
                                                            alamat pengiriman
                                                        </li>
                                                        <li>
                                                            Pilih jasa
                                                            pengiriman yang
                                                            tersedia
                                                        </li>
                                                        <li>
                                                            Masukkan kode
                                                            voucher (opsional)
                                                        </li>
                                                        <li>
                                                            Cek total pembayaran
                                                        </li>
                                                        <li>
                                                            Pilih metode
                                                            pembayaran
                                                        </li>
                                                        <li>
                                                            Klik "Buat Pesanan"
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem
                                        value="payment"
                                        className="border rounded-lg"
                                    >
                                        <AccordionTrigger className="px-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                                            Pembayaran Midtrans
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Cara Pembayaran:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Setelah klik "Buat
                                                            Pesanan", Anda akan
                                                            diarahkan ke halaman
                                                            Midtrans
                                                        </li>
                                                        <li>
                                                            Pilih metode
                                                            pembayaran yang
                                                            tersedia:
                                                            <ul className="list-disc pl-5 mt-1">
                                                                <li>
                                                                    Transfer
                                                                    Bank (BCA,
                                                                    Mandiri,
                                                                    BNI, dll)
                                                                </li>
                                                                <li>
                                                                    E-wallet
                                                                    (GoPay, OVO,
                                                                    DANA, dll)
                                                                </li>
                                                                <li>
                                                                    Virtual
                                                                    Account
                                                                </li>
                                                                <li>
                                                                    Kartu Kredit
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            Ikuti instruksi
                                                            pembayaran sesuai
                                                            metode yang dipilih
                                                        </li>
                                                        <li>
                                                            Lakukan pembayaran
                                                            sebelum batas waktu
                                                            berakhir
                                                        </li>
                                                        <li>
                                                            Simpan bukti
                                                            pembayaran
                                                        </li>
                                                        <li>
                                                            Status pesanan akan
                                                            otomatis diperbarui
                                                            setelah pembayaran
                                                            terverifikasi
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem
                                        value="review"
                                        className="border rounded-lg"
                                    >
                                        <AccordionTrigger className="px-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                                            Review & Refund
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Memberikan Review:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Buka menu "Pesanan
                                                            Selesai"
                                                        </li>
                                                        <li>
                                                            Pilih produk yang
                                                            ingin direview
                                                        </li>
                                                        <li>
                                                            Klik tombol "Beri
                                                            Review"
                                                        </li>
                                                        <li>
                                                            Beri rating bintang
                                                            (1-5)
                                                        </li>
                                                        <li>
                                                            Tulis komentar
                                                            tentang produk
                                                        </li>
                                                        <li>
                                                            Unggah foto produk
                                                            (opsional)
                                                        </li>
                                                        <li>
                                                            Klik "Kirim Review"
                                                        </li>
                                                    </ol>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Mengajukan Refund:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Buka detail pesanan
                                                            yang ingin direfund
                                                        </li>
                                                        <li>
                                                            Klik tombol "Ajukan
                                                            Refund"
                                                        </li>
                                                        <li>
                                                            Pilih alasan refund
                                                        </li>
                                                        <li>
                                                            Unggah foto bukti
                                                            (jika diperlukan)
                                                        </li>
                                                        <li>
                                                            Tulis keterangan
                                                            detail
                                                        </li>
                                                        <li>
                                                            Pilih metode
                                                            pengembalian dana
                                                        </li>
                                                        <li>
                                                            Tunggu konfirmasi
                                                            dari tim kami
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem
                                        value="verification"
                                        className="border rounded-lg"
                                    >
                                        <AccordionTrigger className="px-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                                            Verifikasi & Alamat
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Verifikasi Nomor:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Masuk ke menu
                                                            "Profil"
                                                        </li>
                                                        <li>
                                                            Klik "Verifikasi
                                                            Nomor"
                                                        </li>
                                                        <li>
                                                            Masukkan nomor
                                                            telepon aktif
                                                        </li>
                                                        <li>
                                                            Klik "Kirim Kode
                                                            OTP"
                                                        </li>
                                                        <li>
                                                            Cek SMS masuk untuk
                                                            kode OTP
                                                        </li>
                                                        <li>
                                                            Masukkan kode OTP
                                                        </li>
                                                        <li>
                                                            Klik "Verifikasi"
                                                        </li>
                                                    </ol>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Menambah Alamat:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Buka menu "Alamat
                                                            Saya"
                                                        </li>
                                                        <li>
                                                            Klik "Tambah Alamat
                                                            Baru"
                                                        </li>
                                                        <li>
                                                            Gunakan fitur
                                                            pencarian di peta
                                                        </li>
                                                        <li>
                                                            Atur pin lokasi
                                                            dengan tepat
                                                        </li>
                                                        <li>
                                                            Isi informasi alamat
                                                            lengkap:
                                                            <ul className="list-disc pl-5 mt-1">
                                                                <li>
                                                                    Label alamat
                                                                </li>
                                                                <li>
                                                                    Nama
                                                                    penerima
                                                                </li>
                                                                <li>
                                                                    Nomor
                                                                    telepon
                                                                </li>
                                                                <li>
                                                                    Detail
                                                                    alamat
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            Centang sebagai
                                                            alamat utama
                                                            (opsional)
                                                        </li>
                                                        <li>
                                                            Klik "Simpan Alamat"
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem
                                        value="tracking"
                                        className="border rounded-lg"
                                    >
                                        <AccordionTrigger className="px-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                                            Tracking Pesanan
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Melacak Pesanan:
                                                    </h3>
                                                    <ol className="list-decimal pl-5 space-y-1">
                                                        <li>
                                                            Buka menu "Pesanan
                                                            Saya"
                                                        </li>
                                                        <li>
                                                            Pilih pesanan yang
                                                            ingin dilacak
                                                        </li>
                                                        <li>
                                                            Klik "Lacak Pesanan"
                                                        </li>
                                                        <li>
                                                            Lihat informasi
                                                            status pesanan:
                                                            <ul className="list-disc pl-5 mt-1">
                                                                <li>
                                                                    Pesanan
                                                                    dibuat
                                                                </li>
                                                                <li>
                                                                    Pembayaran
                                                                    diterima
                                                                </li>
                                                                <li>
                                                                    Pesanan
                                                                    diproses
                                                                </li>
                                                                <li>
                                                                    Pesanan
                                                                    dikirim
                                                                </li>
                                                                <li>
                                                                    Pesanan
                                                                    diterima
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            Cek nomor resi
                                                            pengiriman
                                                        </li>
                                                        <li>
                                                            Pantau lokasi paket
                                                            terkini
                                                        </li>
                                                        <li>
                                                            Konfirmasi
                                                            penerimaan pesanan
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </ClientLayout>
        </div>
    );
}
