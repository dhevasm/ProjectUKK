import { Product } from "@/types";
import { Check, Copy, Share2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ShareModal({product} : {product: Product}) {
    const [copied, setCopied] = useState(false);
    const linkRef = useRef<HTMLInputElement>(null);

    const socialMediaPlatforms = [
        {
            name: "WhatsApp",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/whatsapp.svg",
            color: "bg-green-500",
            shareUrl: `https://wa.me/?text=Check out this product: ${product.name}`,
        },
        {
            name: "Facebook",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/facebook.svg",
            color: "bg-blue-600",
            shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
        },
        {
            name: "Twitter",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/twitter.svg",
            color: "bg-sky-500",
            shareUrl: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this product: ${product.name}`,
        },
        {
            name: "Telegram",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/telegram.svg",
            color: "bg-blue-500",
            shareUrl: `https://t.me/share/url?url=${window.location.href}&text=Check out this product: ${product.name}`,
        },
    ];

    const handleCopyLink = () => {
        if (linkRef.current) {
            linkRef.current.select();
            document.execCommand("copy");
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

  return (
    <Dialog>
    <DialogTrigger asChild>
        <Button
            variant="outline"
            size="icon"
        >
            <Share2 className="h-5 w-5" />
        </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <DialogTitle>
                Bagikan
                Produk
            </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Input
                    ref={
                        linkRef
                    }
                    readOnly
                    value={
                        window
                            .location
                            .href
                    }
                    className="flex-1"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={
                        handleCopyLink
                    }
                >
                    {copied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-4">
                {socialMediaPlatforms.map(
                    (
                        platform
                    ) => (
                        <a
                            key={
                                platform.name
                            }
                            href={
                                platform.shareUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "flex items-center justify-center gap-2 rounded-lg p-4 text-white transition-colors hover:opacity-90",
                                platform.color
                            )}
                        >
                            <img
                                src={
                                    platform.icon
                                }
                                alt={
                                    platform.name
                                }
                                className="h-6 w-6 invert"
                            />
                            <span>
                                {
                                    platform.name
                                }
                            </span>
                        </a>
                    )
                )}
            </div>
        </div>
    </DialogContent>
</Dialog>
  )
}
