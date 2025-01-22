import { PageProps } from "@/types";
import DeleteUserForm from "../Profile/Partials/DeleteUserForm";
import UpdatePasswordForm from "../Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "../Profile/Partials/UpdateProfileInformationForm";
import UpdateImage from "../Profile/Partials/UpdateImage";
import AddressInput from "../Profile/Partials/AddressInput";
import ClientLayout from "@/Layouts/ClientLayout";
import { LucideMoveLeft } from "lucide-react";
import { router } from "@inertiajs/react";
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
    totalCart,
    role
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {


    return (
        <div className="bg-gray-100 dark:bg-customDark2">
            <ClientLayout role={role} categories={categories} settings={settings} Products={products} auth={auth} totalCart={totalCart} header={"Profile"}>
                <div className="py-7 ">
                    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
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
                            <div className=" text-end">
                               <button
                                    onClick={() => window.history.back()}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-customDark rounded-full transition-colors"
                                >
                                    <LucideMoveLeft className="w-5 h-5 text-[var(--app-color)]" />
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

                        <div id="address" className="bg-white dark:bg-customDark p-4 shadow sm:rounded-lg sm:p-8">
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
            </ClientLayout>
        </div>
    );
}
