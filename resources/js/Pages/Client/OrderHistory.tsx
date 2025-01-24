import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ChevronRight, LucideMoveLeft, ShoppingBag } from "lucide-react";
import ClientLayout from "@/Layouts/ClientLayout";
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
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
}: PropsType) => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <ClientLayout
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
        />
    ) : (
        <div className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Order History</h1>
            <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-customDark rounded-full transition-colors"
            >
                <LucideMoveLeft className="w-5 h-5 text-[var(--app-color)]" />
            </button>
            </div>

            <div className="space-y-3 mb-20">

            {transactions.length === 0 && (
                <div className="text-center py-10">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
                    <p className="text-gray-500">You have not placed any orders yet.</p>
                    <Button
                        className="mt-6"
                        onClick={() => router.get(route("welcome"))}
                        variant={"theme"}
                    >
                        Continue Shopping
                    </Button>
                </div>
            )}

            {transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow bg-white dark:bg-customDark">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                        <img
                        src={transaction.product.product_images[0]?.url}
                        alt={transaction.product.name}
                        className="w-full h-full object-cover rounded-md"
                        />
                    </div>

                    {/* transaction Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between g  ap-2">
                        <div>
                            <p className="text-sm text-gray-500">Order Id : {transaction.payment.order_id}

                        </p>

                            <h3 className="font-medium text-base mt-0.5 truncate">
                            {transaction.product.name + ' | ' + transaction.data_undangan.groom_name + ' & ' + transaction.data_undangan.bride_name}
                            </h3>
                        </div>
                        {
                            transaction.payment.status !== 'settlement' ? (
                                <Badge
                                variant={
                                    transaction.payment.status === 'pending' ? 'warning' : 'destructive'
                                }
                                className="flex-shrink-0 ms-2"
                            >
                                {transaction.payment.status === 'settlement' ? 'Telah Dibayar' : transaction.payment.status === 'pending' ? 'Menunggu Pembayaran' : transaction.payment.status}
                            </Badge>
                            ) : transaction.status == 'delivery' ?
                            <Badge
                            variant={
                               transaction.delivery.status == "delivered" ? "success" :
                               "info"
                            }
                            className="flex-shrink-0"
                        >
                            {transaction.delivery.status == "delivered" ? "Barang Sampai Di Tujuan" : "Proses Pengiriman"}
                        </Badge>
                            :
                            (
                                <Badge
                                variant={
                                    transaction.status === 'completed' ? 'success' :
                                    transaction.status === 'cancelled' ? 'destructive' : 'warning'
                                }
                                className="flex-shrink-0"
                            >
                                {transaction.status === 'pending' ? 'Menuggu Konfirmasi Admin' : transaction.status === 'proccess' ? 'Proses Pengerjaan' : transaction.status == "completed" ? "Transaksi Selesai" : 'Dibatalkan'}
                            </Badge>
                            )
                        }
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Qty:</span>
                            <span className="font-medium">{transaction.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Price per pcs:</span>
                            <span className="font-medium">Rp. {transaction.product.price.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Total Price:</span>
                            <span className="font-medium">Rp. {transaction.payment.gross_amount.toLocaleString("id-ID")}</span>
                        </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {new Date(transaction.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                            })}
                        </p>

                        <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="flex items-center text-sm text-[var(--app-color)] hover:underline"
                            >
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
    )}
    </ClientLayout>
  );
};

export default OrderHistory;
