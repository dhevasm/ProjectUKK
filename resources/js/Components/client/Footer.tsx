import { useState, useEffect } from "react"
import { Link } from "@inertiajs/react";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from 'lucide-react';


interface FooterData {
    description: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
}

interface settings {
    key: string;
    value: string;
    type: string;
}

export default function Footer({settings} : {settings: settings[]}) {
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
    <footer className="bg-gray-100 py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg mb-4">{appName}</h3>
            <p className="text-gray-600 text-sm">
               {footerData.description}
            </p>
        </div>

        <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-[var(--app-color)]">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-[var(--app-color)]">Contact</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-[var(--app-color)]">FAQ</Link></li>
                <li><Link href="/shipping" className="text-gray-600 hover:text-[var(--app-color)]">Shipping</Link></li>
            </ul>
        </div>

        <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/returns" className="text-gray-600 hover:text-[var(--app-color)]">Returns</Link></li>
                <li><Link href="/track-order" className="text-gray-600 hover:text-[var(--app-color)]">Track Order</Link></li>
                <li><Link href="/support" className="text-gray-600 hover:text-[var(--app-color)]">Support</Link></li>
            </ul>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-4">Connect With Us</h4>
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
