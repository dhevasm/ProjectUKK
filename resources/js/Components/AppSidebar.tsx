import { Link } from "@inertiajs/react";
import { useState, useEffect, useContext } from "react";
import { User, LayoutDashboard, Settings, ChartBarStacked, Package, PackagePlus  } from "lucide-react";

import { AdminContext } from "@/Layouts/AuthenticatedLayout";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    useSidebar,
} from "@/Components/ui/sidebar";

const items = [
    {
        title: "Dashboard",
        active: "dashboard",
        url: route("dashboard"),
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        active: "user",
        url: route("user.index"),
        icon: User,
    },
    {
        title: "Categories",
        active: "category",
        url: route("category.index"),
        icon: ChartBarStacked,
    },
    {
        title: "Products",
        active: "product",
        url: route("product.index"),
        icon: Package,
    },
    {
        title: "Add Product",
        active: "product/create",
        url: route("product.create"),
        icon: PackagePlus,
    },
    {
        title: "Settings",
        active: "setting",
        url: route("setting.index"),
        icon: Settings,
    },


];

export function AppSidebar() {
    const appName = import.meta.env.VITE_APP_NAME || "Laravel";
    const activeTab = new URL(window.location.href).pathname.substring(1);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { state } = useSidebar();
    const adminContext = useContext(AdminContext);

    useEffect(() => {
        state == "collapsed" ? setIsCollapsed(true) : setIsCollapsed(false);
        adminContext?.setIsSidebarCollapsed(state == "collapsed" ? true : false);
    }, [state]);

    return (
        <Sidebar collapsible="icon" className="z-50">
            <SidebarHeader>
                <Link
                    href="/"
                    className="hidden text-[var(--app-color)] md:block text-2xl ms-2 mt-2 font-bold"
                >
                    {isCollapsed ? appName.charAt(0) : appName}
                </Link>
                <Link
                    href="/"
                    className="block text-[var(--app-color)] md:hidden text-2xl ms-2 mt-2 font-bold"
                >
                    {appName}
                </Link>
            </SidebarHeader>
            <style>
                {
                    `
                    .active{
                        color: var(--app-color);
                    }

                    .active:hover{
                        color: var(--app-color) !important;
                    }
                    `
                }
            </style>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <>
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className={`${item.active == activeTab && "active"} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                                            <item.icon />
                                            <span className="group-data-[state=closed]:hidden">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                </>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
