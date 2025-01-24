import { Link } from "@inertiajs/react";
import { useState, useEffect, useContext } from "react";
import { User, LayoutDashboard, Settings, ChartBarStacked, Package, Wallet, Truck, ChartNoAxesCombined, HandCoins,Star} from "lucide-react";
import { AdminContext } from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react"
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
        icon: ChartNoAxesCombined,
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
        title: "Transcation",
        active: "transaction",
        url: route("transaction.index"),
        icon: Wallet,
    },
    {
        title: "Delivery",
        active: "delivery",
        url: route("delivery.index"),
        icon: Truck,
    },
    {
        title: "Refund",
        active: "refund",
        url: route("refund.index"),
        icon: HandCoins,
    },
    {
        title: "Review",
        active: "review",
        url: route("review.index"),
        icon: Star,
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
    const [search, setSearch] = useState("");

    const { state } = useSidebar();
    const adminContext = useContext(AdminContext);

    useEffect(() => {
        state === "collapsed" ? setIsCollapsed(true) : setIsCollapsed(false);
        adminContext?.setIsSidebarCollapsed(state === "collapsed" ? true : false);
    }, [state]);

    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

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

            <div className={isCollapsed ? "hidden" : "block p-3  relative"}>
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2  w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Search menu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 dark:border-gray-800 text-sm rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-[var(--app-color)]"
                />
            </div>

            <style>
                {`
                    .active {
                        color: var(--app-color);
                    }
                    .active:hover {
                        color: var(--app-color) !important;
                    }
                `}
            </style>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={`${item.active === activeTab ? "active" : ""} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                            >
                                                <item.icon />
                                                <span className="ml-2 group-data-[state=closed]:hidden">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center text-sm">No results found</p>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
