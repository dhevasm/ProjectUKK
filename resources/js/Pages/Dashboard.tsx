import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Users, ShoppingBag, DollarSign, Truck } from "lucide-react";
import Chart from "react-apexcharts";
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

interface DashboardProps {
    totalUser: number;
    productsSold: number;
    revenue: number;
    deliveries: number;
    transactionsByStatus : Array<{ status: string, count: number }>;
    monthlyRevenue: number[];
    monthlyProductsSold: number[];
}

export default function Dashboard({ totalUser, productsSold, revenue, deliveries, transactionsByStatus, monthlyRevenue, monthlyProductsSold }: DashboardProps) {
    const donutChartOptions = {
        labels: transactionsByStatus.map((status) => status.status),
        colors: ["gray", "yellow", "blue", "green", "red"],
    };


    const donutChartSeries = transactionsByStatus.map((status) => status.count);

    const barChartOptions = {
        chart: { type: "bar" as const },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
        colors: ["var(--app-color"],
    };

    const barChartSeries = [{ name: "Penjualan",data: [monthlyProductsSold[1], monthlyProductsSold[2], monthlyProductsSold[3], monthlyProductsSold[4], monthlyProductsSold[5], monthlyProductsSold[6], monthlyProductsSold[7], monthlyProductsSold[8], monthlyProductsSold[9], monthlyProductsSold[10], monthlyProductsSold[11], monthlyProductsSold[12]] }];

    const lineChartOptions = {
        chart: { type: "line" as const },
        stroke: { curve: "smooth" as const },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
        colors:["var(--app-color"],
    };

    const lineChartSeries = [{ name: "Pendapatan", data: [monthlyRevenue[1], monthlyRevenue[2], monthlyRevenue[3], monthlyRevenue[4], monthlyRevenue[5], monthlyRevenue[6], monthlyRevenue[7], monthlyRevenue[8], monthlyRevenue[9], monthlyRevenue[10], monthlyRevenue[11], monthlyRevenue[12]] }];

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
                    <Card onClick={() => router.get(route("user.index"))} className="hover:shadow-lg hover:cursor-pointer transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Pengguna</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUser}</div>
                            {/* <p className="text-xs text-muted-foreground">+12.5% from last month</p> */}
                        </CardContent>
                    </Card>

                    <Card  onClick={() => router.get(route("transaction.index"))} className="hover:shadow-lg hover:cursor-pointer transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Produk Terjual</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productsSold}</div>
                            {/* <p className="text-xs text-muted-foreground">+8.2% from last month</p> */}
                        </CardContent>
                    </Card>

                    <Card onClick={() => router.get(route("transaction.index"))} className="hover:shadow-lg hover:cursor-pointer transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pendapatan</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {revenue.toLocaleString("id-ID")}</div>
                            {/* <p className="text-xs text-muted-foreground">+15.3% from last month</p> */}
                        </CardContent>
                    </Card>

                    <Card onClick={() => router.get(route("delivery.index"))} className="hover:shadow-lg hover:cursor-pointer transition-shadow bg-white dark:bg-customDark">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Antrian Pengiriman</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{deliveries}</div>
                            {/* <p className="text-xs text-muted-foreground">+6.8% from last month</p> */}
                        </CardContent>
                    </Card>
                </div>
                </div>

                <div className="grid w-full gap-6 grid-cols-1 md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-muted-foreground">
                               Status Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={300} />
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-customDark">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-muted-foreground">
                                Penjualan Per Bulan
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
                                Pendapatan Per Bulan
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
