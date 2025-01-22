import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Users, ShoppingBag, DollarSign, Truck } from "lucide-react";
import Chart from "react-apexcharts";

interface DashboardProps {
    totalUser: number;
    productsSold: number;
    revenue: number;
    deliveries: number;
}

export default function Dashboard({ totalUser, productsSold, revenue, deliveries }: DashboardProps) {
    const donutChartOptions = {
        labels: ["Active Users", "Inactive Users"],
        colors: ["var(--app-color", "var(--app-hover-color)"],
    };

    const donutChartSeries = [totalUser * 0.8, totalUser * 0.2];

    const barChartOptions = {
        chart: { type: "bar" as const },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
        colors: ["var(--app-color"],
    };

    const barChartSeries = [{ name: "Sales", data: [30, 40, 45, 50, 49, 60, 40, 40, 40, 40, 40, 40] }];

    const lineChartOptions = {
        chart: { type: "line" as const },
        stroke: { curve: "smooth" as const },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
        colors:["var(--app-color"],
    };

    const lineChartSeries = [{ name: "Revenue", data: [10000, 15000, 18000, 22000, 25000, revenue, 100, 100, 100, 100, 100, 100, 100] }];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 px-4 md:px-2 md:ps-6">
            <div className='flex flex-col gap-4  md:flex-row w-full'>
                <div className="grid w-full gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUser}</div>
                            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Products Sold</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productsSold}</div>
                            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {revenue.toLocaleString("id-ID")}</div>
                            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Deliveries</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{deliveries}</div>
                            <p className="text-xs text-muted-foreground">+6.8% from last month</p>
                        </CardContent>
                    </Card>
                </div>
                </div>

                <div className="grid w-full gap-6 grid-cols-1 md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-muted-foreground">
                                User Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={300} />
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-muted-foreground">
                                Monthly Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid w-full gap-6 grid-cols-1 mt-5">
                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-muted-foreground">
                                Revenue Growth
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={400} />
                        </CardContent>
                    </Card>
                </div>

                </div>

        </AuthenticatedLayout>
    );
}
