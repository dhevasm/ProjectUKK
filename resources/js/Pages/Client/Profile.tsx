import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "../Profile/Partials/DeleteUserForm";
import UpdatePasswordForm from "../Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "../Profile/Partials/UpdateProfileInformationForm";
import UpdateImage from "../Profile/Partials/UpdateImage";
import AddressInput from "../Profile/Partials/AddressInput";
import { Toaster } from "sonner";
import Header from "@/Components/client/Header";
import Footer from "@/Components/client/Footer";
import { LucideMoveLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

export default function Profile({
    mustVerifyEmail,
    status,
    settings,
    categories,
    auth,
    products,
    totalCart
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {

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
        <div className="bg-gray-100 dark:bg-customDark2">
            <Head title="Profile" />
            <Header settings={settings} categories={categories} auth={auth} products={products} totalCart={totalCart} />
            <div className="py-12">
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
                                            Home
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            href="#"
                                            onClick={() =>
                                                router.get(
                                                    route("user.profile")
                                                )
                                            }
                                        >
                                            Profile
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="mb-4 text-end">
                            <button onClick={() => router.get(route("welcome"))}>
                                <LucideMoveLeft className="text-[var(--app-color)]" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateImage />
                        </div>

                        <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                        <AddressInput />
                    </div>

                    <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
            <Toaster richColors position="top-right" theme={theme} />
            <Footer settings={settings} />
        </div>
    );
}
