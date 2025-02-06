import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ChevronRight, LucideMoveLeft, ShoppingBag } from "lucide-react";
import ClientLayout from "@/Layouts/ClientLayout";
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import TransactionDetail from './TransactionDetail';

import { Category, Product, settings, User, dataUndangan } from '@/types';
interface Payment{
    id: string;
    order_id: string;
    snap_token: string;
    user: User;
    payment_method: string;
    gross_amount: number;
    status: string;
}

interface Delivery{
    id: string;
    user: User;
    name: string;
    phone: string;
    address: string;
    coordinates: string;
    status: string;
}

interface Transaction {
    id: string;
    payment: Payment;
    delivery: Delivery;
    user: User;
    product: Product;
    data_undangan: dataUndangan;
    quantity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Tracking {
    id: string;
    delivery_id: string;
    ordered: string;
    proccess: string;
    delivery: string;
    delivered: string;
    completed: string;
    cancelled: string;
    status: string;
}

export type RefundType = {
    id: number;
    user: User;
    payment: Payment;
    reason: string;
    status: string;
    no_rekening: number;
    name: string;
    bank: string;
    message: string;
    created_at: string;
};

interface PropsType {
    categories: Category[];
    settings: settings[];
    Products: Product[];
    auth: {
        user: User;
    };
    totalCart: number;
    transactions: Transaction[];
    trackings: Tracking[];
    role: string;
    refund: RefundType[];
    admin: User;
}

const OrderHistory = ({
    categories,
    settings,
    Products,
    auth,
    totalCart,
    transactions,
    trackings,
    role,
    refund,
    admin
}: PropsType) => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [otherTransaction, setOtherTransaction] = useState<Transaction[]>([]);

    useEffect(() => {
        if (selectedTransaction) {
            const filteredTransactions = transactions.filter(
                (transaction) => transaction.payment.order_id === selectedTransaction.payment.order_id
            );
            setOtherTransaction(filteredTransactions);
        } else {
            setOtherTransaction([]);
        }
    }, [selectedTransaction, transactions]);

    const groupedTransactions = useMemo(() => {
        return transactions.reduce((acc, transaction) => {
            const existingGroup = acc.find(group =>
                group[0].payment.order_id === transaction.payment.order_id
            );

            if (existingGroup) {
                existingGroup.push(transaction);
            } else {
                acc.push([transaction]);
            }

            return acc;
        }, [] as Transaction[][]);
    }, [transactions]);

    return (
        <ClientLayout
            admin={admin}
            role={role}
            categories={categories}
            settings={settings}
            Products={Products}
            auth={auth}
            totalCart={totalCart}
            header="Order History"
        >
        {selectedTransaction ? (
            <TransactionDetail
                transaction={selectedTransaction}
                onBack={() => setSelectedTransaction(null)}
                trackings={trackings}
                otherTransactions={otherTransaction.length > 0 ? otherTransaction.slice(1) : undefined}
                refund={refund.find(r => r.payment.order_id === selectedTransaction.payment.order_id)}
            />
        ) : (
            <div className="container mx-auto py-4 px-2 sm:px-4 md:px-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">Pesanan Saya</h1>
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-customDark rounded-full transition-colors"
                    >
                        <LucideMoveLeft className="w-5 h-5 text-[var(--app-color)]" />
                    </button>
                </div>

                <div className="space-y-3 mb-20">
                    {groupedTransactions.length === 0 && (
                    <div className="text-center py-10">
                        <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">Tidak ada pesanan</h2>
                        <p className="text-sm sm:text-base text-gray-500 mb-4">Anda belum melakukan pemesanan.</p>
                        <Button
                            className="mt-2 sm:mt-6"
                            onClick={() => router.get(route("welcome"))}
                            variant={"theme"}
                        >
                            Lanjut Belanja
                        </Button>
                    </div>
                    )}

                    {groupedTransactions.map((transactionGroup) => {
                    const firstTransaction = transactionGroup[0];
                    const totalQuantity = transactionGroup.reduce((sum, t) => sum + t.quantity, 0);
                    const totalAmount = transactionGroup[0].payment.gross_amount;

                    return (
                        <Card key={firstTransaction.payment.order_id} className="hover:shadow-md transition-shadow bg-white dark:bg-customDark">
                        <CardContent className="p-3 sm:p-4 ">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                {/* Product Images */}
                                <div className="flex -space-x-2 sm:-space-x-3 mb-2 sm:mb-0">
                                    {transactionGroup.slice(0, 3).map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 border-2 border-white rounded-md overflow-hidden"
                                    >
                                        <img
                                        src={transaction.product.product_images[0]?.url}
                                        alt={transaction.product.name}
                                        className="w-full h-full object-cover"
                                        />
                                    </div>
                                    ))}
                                    {transactionGroup.length > 3 && (
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs sm:text-sm">
                                        +{transactionGroup.length - 3}
                                    </div>
                                    )}
                                </div>

                                {/* Transaction Details */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" >
                                        <div className="w-full">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1">Order Id : {firstTransaction.payment.order_id}</p>
                                            <h3 className="font-medium text-sm sm:text-base mt-0.5 truncate">
                                                {transactionGroup.map(t => t.product.name).join(', ')}
                                            </h3>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 mt-1 sm:mt-0 me-10">
                                            {firstTransaction.payment.status !== 'settlement' ? (
                                                <Badge
                                                    variant={
                                                    firstTransaction.payment.status === 'pending' ? 'warning' : 'destructive'
                                                    }
                                                    className="flex-shrink-0"
                                                >
                                                    {firstTransaction.payment.status === 'settlement' ? 'Telah Dibayar' :
                                                     firstTransaction.payment.status === 'pending' ? 'Menunggu Pembayaran' :
                                                     firstTransaction.payment.status === 'refund' ? 'Refunded' :
                                                     firstTransaction.payment.status}
                                                </Badge>
                                            ) : firstTransaction.status == 'delivery' ? (
                                                <Badge
                                                    variant={
                                                    firstTransaction.delivery.status == "delivered" ? "success" : "info"
                                                    }
                                                    className="flex-shrink-0"
                                                >
                                                    {firstTransaction.delivery.status == "delivered" ? "Barang Sampai Di Tujuan" : "Proses Pengiriman"}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant={
                                                    firstTransaction.status === 'completed' ? 'success' :
                                                    firstTransaction.status === 'cancelled' ? 'destructive' : 'warning'
                                                    }
                                                    className="flex-shrink-0"
                                                >
                                                    {firstTransaction.status === 'pending' ? 'Menunggu Konfirmasi' :
                                                     firstTransaction.status === 'proccess' ? 'Proses Pengerjaan' :
                                                     firstTransaction.status == "completed" ? "Transaksi Selesai" : 'Dibatalkan'}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Qty:</span>
                                            <span className="font-medium">{totalQuantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Total Price:</span>
                                            <span className="font-medium">Rp. {totalAmount.toLocaleString("id-ID")}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
                                            {new Date(firstTransaction.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                            })}
                                        </p>

                                        <button
                                            onClick={() => setSelectedTransaction(firstTransaction)}
                                            className="flex items-center text-xs sm:text-sm text-[var(--app-color)] hover:underline"
                                        >
                                            Lihat Selengkapnya
                                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    );
                    })}
                </div>
            </div>
        )}
        </ClientLayout>
    );
};

export default OrderHistory;
