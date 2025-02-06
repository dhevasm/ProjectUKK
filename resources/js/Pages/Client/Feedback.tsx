import { PageProps } from "@/types";
import ClientLayout from "@/Layouts/ClientLayout";
import { LucideMoveLeft, Send } from "lucide-react";
import { router } from "@inertiajs/react";
import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { toast } from "sonner";

export default function Feedback({
    settings,
    categories,
    auth,
    products,
    totalCart,
    role,
    admin,
}: PageProps) {
    const [formData, setFormData] = useState({
        name: auth?.user?.name || "",
        email: auth?.user?.email || "",
        subject: "",
        type: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route("feedback.store"), formData, {
            preserveScroll: true,
            onSuccess: () => {
             toast.success('Terkirim.', {
                    description: 'Feedback anda berhasil dikirim ke email kami.'
                });
            },
            onError: () => {
                toast.error('Failed.', {
                    description: 'Terjadi Kesalahan.'
                });
            }
        });
    };

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
                header="Feedback"
            >
                <div className="py-7">
                    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                        {/* Breadcrumb */}
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
                                                onClick={() => router.get(route("feedback"))}
                                            >
                                                Feedback
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
                        <div className="max-w-3xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kirim Feedback</CardTitle>
                                    <CardDescription>
                                        Kami sangat menghargai masukan Anda untuk meningkatkan layanan kami
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nama</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    placeholder="Masukkan nama Anda"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    placeholder="Masukkan email Anda"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subjek</Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                placeholder="Subjek feedback"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="type">Tipe Feedback</Label>
                                            <Select
                                                onValueChange={(value) => setFormData({...formData, type: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih tipe feedback" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="saran">Saran</SelectItem>
                                                    <SelectItem value="keluhan">Keluhan</SelectItem>
                                                    <SelectItem value="kepuasan">Kepuasan</SelectItem>
                                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Pesan</Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                placeholder="Tulis pesan Anda di sini..."
                                                className="min-h-[150px]"
                                                required
                                            />
                                        </div>

                                        <Button variant={"theme"} type="submit" className="w-full">
                                            <Send className="w-4 h-4 mr-2" />
                                            Kirim Feedback
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </ClientLayout>
        </div>
    );
}
