import { useState, useEffect } from "react"
import { Link, router } from "@inertiajs/react";
import { settings } from "@/types";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MapPin
} from 'lucide-react';
import { User } from "@/types";

import {BiLogoWhatsapp, BiEnvelope, BiPhone} from 'react-icons/bi'

interface FooterData {
    description: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
}


export default function Footer({settings, admin} : {settings: settings[], admin: User}) {
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
        const [footerData, setFooterData] = useState<FooterData>({
            description: '',
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
        });

           useEffect(() => {
                settings.forEach((setting) => {
                    if (setting.key === "web_footer_desc") {
                        setFooterData((prev) => ({ ...prev, description: setting.value }));
                    }
                    if (setting.key === "web_fb_link") {
                        setFooterData((prev) => ({ ...prev, facebook: setting.value }));
                    }
                    if (setting.key === "web_ig_link") {
                        setFooterData((prev) => ({ ...prev, instagram: setting.value }));
                    }
                    if (setting.key === "web_tw_link") {
                        setFooterData((prev) => ({ ...prev, twitter: setting.value }));
                    }
                    if (setting.key === "web_ln_link") {
                        setFooterData((prev) => ({ ...prev, linkedin: setting.value }));
                    }
                });
            }, [])

  return (
    <footer className="bg-gray-100 dark:bg-customDark py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 lg:col-span-1">
            <Link href={route("welcome")} className="font-bold text-lg mb-4 flex items-center">
                <img src="/favicon.ico" alt="favicon" className="w-8 h-8 inline-block mr-2" />
                {appName}
            </Link>
            <p className="text-gray-600 text-sm">
               {footerData.description}
            </p>
        </div>

        <div>
            <h4 className="font-semibold mb-4">Layanan Pelanggan</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href={route("help")} className="text-gray-600 hover:text-[var(--app-color)]">Bantuan</Link></li>
                <li><Link href={route("kebijakan")} className="text-gray-600 hover:text-[var(--app-color)]">Kebijakan</Link></li>
                <li><Link href={route("feedback")} className="text-gray-600 hover:text-[var(--app-color)]">Umpan Balik</Link></li>
                <li><Link href={route("about")} className="text-gray-600 hover:text-[var(--app-color)]">Tentang Kami</Link></li>
            </ul>
        </div>

        <div>
            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm">
                <li><a href={`https://mail.google.com/mail/u/0/?tf=cm&fs=1&to=${admin.email}`} target="_blank"  className="text-gray-600 hover:text-[var(--app-color)] flex gap-1"><BiEnvelope className="text-xl"/>{admin.email}</a></li>
                <li><a href={`tel:${admin.phone}`} className="text-gray-600 hover:text-[var(--app-color)] flex gap-1"><BiPhone className="text-xl"/>{admin.phone}</a></li>
                <li><a href={`https://wa.me/${admin.phone}`} target="_blank"  className="text-gray-600 hover:text-[var(--app-color)] flex gap-1"><BiLogoWhatsapp className="text-xl"/>
                {admin.phone}</a></li>
                <li><a href="https://maps.app.goo.gl/49qA1Xq1KqU1uMuy8" target="_blank" className="text-gray-600 hover:text-[var(--app-color)] flex gap-1"><MapPin className="self-start" size={50}/>{admin.address}</a></li>
            </ul>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-4">Pembayaran</h4>
            <div className="space-x-4 space-y-4">
                <div className="flex gap-4 ms-4">
                <img src="/payments/dana.png" className="w-11 bg-white" alt="qris" title="dana" />
                <img src="/payments/gopay.png" className="w-11 " alt="gopay" title="gopay" />
                <img src="/payments/ovo.png" className="w-10"  alt="ovo" title="ovo" />
                <img src="/payments/shopepay.png" className="w-10 bg-white" alt="shopee pay" title="shopee pay" />
                <img src="/payments/linkaja.png" className="w-10 bg-white" alt="link aja" title="link aja" />
                </div>
                <div className="flex gap-4 ">
                <img src="/payments/bca.png" className="w-10" alt="bri" title="bca" />
                <img src="/payments/bri.png" className="w-10" alt="bca" title="bri" />
                <img src="/payments/bni.png" className="w-10" alt="bni" title="bni" />
                <img src="/payments/mandiri.png" className="w-10" alt="mandiri" title="mandiri" />
                <img src="/payments/permata.png" className="w-10" alt="permata" title="permata" />
                </div>
                <div className="flex gap-4 ">
                <img src="/payments/cimbniaga.png" className="w-10" alt="cimb niaga" title="cimb niaga" />
                <img src="/payments/visa.png" className="w-10" alt="visa" title="visa" />
                <img src="/payments/master.png" className="w-10 bg-white" alt="master card" title="master card" />
                <img src="/payments/jcb.png" className="w-10" alt="jcb" title="jcb" />
                <img src="/payments/americanexpress.png" className="w-10" alt="american express" title="american express" />

                </div>
                <div className="flex gap-4 ">
                <img src="/payments/dandan.png" className="w-10" alt="dandan" title="dandan" />
                <img src="/payments/akulaku.png" className="w-10" alt="akulaku" title="akulaku" />
                <img src="/payments/kredivo.png" className="w-10" alt="kredivo" title="kredivo" />
                <img src="/payments/alfamart.png" className="w-10" alt="alfamart" title="alfamart" />
                <img src="/payments/indomart.png" className="w-10" alt="indomart" title="indomart" />
                </div>
            </div>
        </div>
        <div>
            <h4 className="font-semibold my-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
                <a target='_blank' href={footerData.facebook} className="text-gray-600 hover:text-[var(--app-color)]"><Facebook size={24} /></a>
                <a target='_blank' href={footerData.instagram} className="text-gray-600 hover:text-[var(--app-color)]"><Instagram size={24} /></a>
                <a target='_blank' href={footerData.twitter} className="text-gray-600 hover:text-[var(--app-color)]"><Twitter size={24} /></a>
                <a target='_blank' href={footerData.linkedin} className="text-gray-600 hover:text-[var(--app-color)]"><Linkedin size={24} /></a>
            </div>
        </div>
    </div>

    <div className="container mx-auto px-4 mt-8 pt-4 border-t text-center text-sm text-gray-600">
        © {appName} {new Date().getFullYear()}. All Rights Reserved.
    </div>
</footer>
  )
}
