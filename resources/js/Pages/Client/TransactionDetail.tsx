import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { LucideMoveLeft, Package, CheckCircle2, Clock, XCircle, DollarSign, Truck, LucideIcon, PackageOpen } from "lucide-react";
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Category, Product, settings, User, dataUndangan } from '@/types';
import RefundModal from './RefundModal';
import ClientSummary from './ClientSummary';

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

interface TimelineStep {
  status: 'payment' | 'pending' | 'processing' | 'delivery' | 'delivered' | 'completed';
  label: string;
  icon: LucideIcon;
  date: string | null;
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

interface TransactionDetailProps {
  transaction: Transaction;
  otherTransactions?: Transaction[];
  onBack: () => void;
  trackings: Tracking[];
  refund?: RefundType;
  admin : User;
}


type StepStatus = 'completed' | 'current' | 'upcoming' | 'cancelled';

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, onBack, trackings, otherTransactions, refund, admin }) => {

    const getTimelineStatus = (): TimelineStep['status'] => {
    if (transaction.payment.status !== 'settlement') {
      return 'payment';
    }
    if(transaction.status === 'delivery'){
        if(transaction.delivery.status == "delivered"){
            return "delivered"
        }else{
            return "delivery"
        }
    }
    switch (transaction.status) {
      case 'pending':
        return 'pending';
      case 'proccess':
        return 'processing';
      case 'delivery':
        return 'delivery';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'payment';
      default:
        return 'payment';
    }
  };

  const currentStatus = getTimelineStatus();

  const formatDate = (dateString: string): string => {
    if(!dateString) return '';

    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [tracking, setTracking] = useState(trackings.find(item => item.delivery_id == transaction.delivery.id));

  const timelineSteps: TimelineStep[] = [
    {
      status: 'payment',
      label: 'Pembayaran',
      icon: DollarSign,
      date: tracking?.ordered  ? formatDate(tracking?.ordered) : null
    },
    {
      status: 'pending',
      label: 'Konfirmasi Admin',
      icon: Clock,
      date: tracking?.ordered ? formatDate(tracking?.proccess) : null
    },
    {
      status: 'processing',
      label: 'Proses Pengerjaan',
      icon: Package,
      date: tracking?.proccess ?  formatDate(tracking?.proccess) : null
    },
    {
      status: 'delivery',
      label: 'Proses Pengiriman',
      icon: Truck,
      date: tracking?.delivery  ? formatDate(tracking?.delivery) : null
    },
    {
      status: 'delivered',
      label: 'Barang Sampai Di Tujuan',
      icon: PackageOpen,
      date: tracking?.delivered ? formatDate(tracking?.delivered) : null
    },
    {
      status: 'completed',
      label: 'Selesai',
      icon: CheckCircle2,
      date: tracking?.completed? formatDate(tracking?.completed) : null
    }
  ];

  const getStepStatus = (stepStatus: TimelineStep['status']): StepStatus => {
    if (transaction.status === 'cancelled') {
      return 'cancelled';
    }

    const statusOrder: TimelineStep['status'][] = ['payment', 'pending', 'processing', 'delivery', 'delivered' ,'completed'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    const stepIdx = statusOrder.indexOf(stepStatus);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const getStatusBadgeVariant = (status: Payment['status'] | Transaction['status']): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    if (status === 'settlement' || status === 'completed') return 'success';
    if (status === 'pending' || status === 'proccess' || status === 'delivery') return 'warning';
    return 'destructive';
  };

  const getStatusLabel = (status: Payment['status'] | Transaction['status']): string => {
    switch (status) {
      case 'settlement':
        return 'Telah Dibayar';
      case 'pending':
        return 'Menunggu Konfirmasi Admin';
      case 'proccess':
        return 'Proses Pengerjaan';
      case 'delivery':
        return 'Proses Pengiriman';
      case 'completed':
        return 'Transaksi Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const updatePayment = (status: string, method:string) => {
    router.post(route("checkout.update"), {
        ids: [transaction.id, transaction.id],
        total: transaction.payment.gross_amount,
        phone: transaction.delivery.phone,
        name: transaction.delivery.name,
        order_id: transaction.payment.order_id,
        method: method,
        status: status,
        snap_token: transaction.payment.snap_token,
},{
    onError: (errors: any) => {
        toast.error("Failed to complete payment", {
            description:
                "An error occurred : " + Object.values(errors)[0],
        });
    },
});
}

const continuePayment = () => {
    window.snap.pay(transaction.payment.snap_token, {
        onSuccess: function(result : any) {
            updatePayment("settlement", result.payment_type);
        },
        onPending: function(result : any) {
            // updatePayment("pending", result.payment_type);
        },
        onError: function(result : any) {
            updatePayment("failed", result.payment_type);
        },
        onClose: function() {
            updatePayment("failed", "type");
        }
    });
}

return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:px-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">Detail Pesanan</h1>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-customDark rounded-full transition-colors"
          type="button"
        >
          <LucideMoveLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--app-color)]" />
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-20">
        {/* Main Order Info */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          <Card className='bg-white dark:bg-customDark'>
            <CardHeader className="border-b p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm text-gray-500">Order ID: {transaction.payment.order_id}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-start sm:items-end">
                  {transaction.delivery.status == "delivery" ? (
                    <Badge className='w-fit' variant={"info"}>Proses Pengiriman</Badge>
                  ) : transaction.delivery.status == "delivered" ? (
                    <Badge className='w-fit' variant={"success"}>Barang Sampai Di Tujuan</Badge>
                  ) : transaction.payment.status != "pending" ? (
                    <Badge className='w-fit' variant={getStatusBadgeVariant(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  ) : (
                    <Badge className='w-fit' variant={getStatusBadgeVariant(transaction.status)}>
                      Menuggu Pembayaran
                    </Badge>
                  )}

                  {tracking?.status == "cancelled" && (
                    <p className='text-xs sm:text-sm text-red-500'>
                      Dibatalkan pada {formatDate(tracking?.cancelled)}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={transaction.product.product_images[0]?.url || '/placeholder.jpg'}
                  alt={transaction.product.name}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg self-start"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-base sm:text-lg">
                    {transaction.product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {transaction.data_undangan.groom_name} & {transaction.data_undangan.bride_name}
                  </p>
                  <div className="mt-2 space-y-1 text-xs sm:text-sm">
                    <p className="text-gray-600">
                      Jumlah item: {transaction.quantity} pcs
                    </p>
                    <p className="text-gray-600">
                     Harga per item: Rp. {transaction.product.price.toLocaleString('id-ID')}
                    </p>

                  </div>
                </div>
              </div>
              {otherTransactions && otherTransactions.length > 0 && (
                <>
                  {otherTransactions.map((transaction, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 mt-4">
                      <img
                        src={transaction.product.product_images[0]?.url || '/placeholder.jpg'}
                        alt={transaction.product.name}
                        className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg self-start"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-base sm:text-lg">
                          {transaction.product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {transaction.data_undangan.groom_name} & {transaction.data_undangan.bride_name}
                        </p>
                        <div className="mt-2 space-y-1 text-xs sm:text-sm">
                          <p className="text-gray-600">
                            Jumlah item: {transaction.quantity} pcs
                          </p>
                          <p className="text-gray-600">
                           Harga per item: Rp. {transaction.product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <p className="font-medium mt-2">
                      Total: Rp. {transaction.payment.gross_amount.toLocaleString('id-ID')}
                    </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className='bg-white dark:bg-customDark'>
            <CardHeader className="border-b">
              <h2 className="text-lg font-medium">Timeline Pesanan</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">

                {timelineSteps.map((step, index) => {
                  const stepStatus = getStepStatus(step.status);
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative flex items-start mb-8 last:mb-0">
                      <div className="flex items-center">
                        <div className={`
                          relative z-10 flex items-center justify-center w-8 h-8 rounded-full
                          ${stepStatus === 'completed' ? 'bg-green-100 dark:bg-green-950 ' :
                            stepStatus === 'current' ? 'bg-blue-100 dark:bg-blue-950' :
                            stepStatus === 'cancelled' ? 'bg-red-100 dark:bg-red-800' : 'bg-gray-100 dark:bg-gray-800'}
                        `}>
                          <Icon className={`w-5 h-5
                            ${stepStatus === 'completed' ? 'text-green-600 dark:text-green-300' :
                              stepStatus === 'current' ? 'text-blue-600 dark:text-blue-300' :
                              stepStatus === 'cancelled' ? 'text-red-600 dark:text-red-300' : 'text-gray-400'}
                          `} />
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className={`
                            absolute left-4 top-8 -bottom-8 w-0.5
                            ${stepStatus === 'completed' ? 'bg-green-400' :
                              stepStatus === 'current' ? 'bg-blue-400' :
                              stepStatus === 'cancelled' ? 'bg-red-400' : 'bg-gray-200'}
                          `} />
                        )}
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {step.label}
                        </div>
                        {step.date && (
                          <div className="text-sm text-gray-500">
                            {step.date}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <Card className='bg-white dark:bg-customDark'>
            <CardHeader className="border-b">
              <h2 className="text-lg font-medium">Informasi Pegiriman</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nama Penerima</p>
                  <p className="font-medium">{transaction.delivery.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Telepon</p>
                  <p className="font-medium">{transaction.delivery.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-medium">{transaction.delivery.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className='bg-white dark:bg-customDark'>
            <CardHeader className="border-b">
              <h2 className="text-lg font-medium">Informasi Pembayaran</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium">{transaction.payment.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah Dibayar</p>
                  <p className="font-medium">Rp. {transaction.payment.gross_amount.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusBadgeVariant(transaction.payment.status)}>
                  {transaction.payment.status == "pending" ? "Belum Dibayar" : getStatusLabel(transaction.payment.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

         {
            transaction.payment.status == "pending" && (
                <div className='flex flex-col gap-2'>
                    <Button onClick={continuePayment} variant={"theme"} className='w-full'>Bayar Sekarang</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button  variant={"outline"} className='w-full'>Batalkan Pembayaran</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Batalkan Pembayaran</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to cancel this payment? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>

                                    <Button  variant="outline" className="bg-red-500 hover:bg-red-600 text-white hover:text-white"onClick={() => {
                        router.get(route("transaction.cancel", transaction.id));
                    }}>
                                        Cancel Transaction
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                </div>
            )
         }

        {
           transaction.payment.status != "settlement" && transaction.payment.status != "pending" ? (
                <Dialog>
                <DialogTrigger asChild>
                <Button  variant={"outline"} className='w-full'>Hapus Histori</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Histori</DialogTitle>
                        <DialogDescription>
                           Apakah anda yakin ingin menghapus histori ini?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>

                        <Button  variant="outline" className="bg-red-500 hover:bg-red-600 text-white hover:text-white"onClick={() => {
                        router.get(route("delete.history", transaction.id));
        }}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            ) : null
         }

         {
            transaction.status == "cancelled" && transaction.payment.status == "settlement" && !refund ?  (
                <div className='flex flex-col gap-2'>
                    <RefundModal payment={transaction.payment} />
                </div>

            ) : null
         }
         {
            refund ? (
                <div className='flex flex-col gap-2'>
                    {
                        refund.status == "rejected" && (
                            <Dialog>
                            <DialogTrigger asChild>
                            <Button  variant={"outline"} className='w-full'>Hapus Histori</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Hapus Histori</DialogTitle>
                                    <DialogDescription>
                                    Apakah anda yakin ingin menghapus histori ini?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>

                                    <Button  variant="outline" className="bg-red-500 hover:bg-red-600 text-white hover:text-white"onClick={() => {
                                    router.get(route("delete.history", transaction.id));
                    }}>
                                        Hapus
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        )
                    }
                    {
                        refund.status == "pending" && (
                            <Button variant={"theme"} className='w-full' disabled>Refund Telah Diajukan</Button>
                        )
                    }
                    <p className='text-center text-sm text-gray-500'>
                        {refund.status == "pending" ? "Menunggu Konfirmasi Admin" : refund.status == "rejected" ? "Pengajuan Refund Ditolak" : "Refund Diterima"}
                    </p>
                </div>
            ) : null
         }
         {
            refund?.message != null && refund?.status == "rejected" ? (
                <div className='bg-red-50 dark:bg-red-950 p-3 rounded-lg'>
                    <p className='text-red-600 text-sm'>Alasan Penolakan : {refund.message}</p>
                </div>
            ) : null
         }
         {
            transaction.status == "completed" && transaction.payment.status == "settlement" ?  (
                <div className='flex flex-col gap-2'>
                    <Button variant={"theme"} onClick={() => router.get(`/product-details/${transaction.product.name.replace(/\s+/g, '-')}#review`)} className='w-full'>Berikan Ulasan</Button>

                    {
                        otherTransactions && otherTransactions.length > 0 ? (
                            <ClientSummary admin={admin} otherTransactions={otherTransactions} name={transaction.delivery.name} product={transaction.product} quantity={transaction.quantity} payment={transaction.payment} status={transaction.status == "completed" ? "success" : "failed"} />
                        ) : (
                            <ClientSummary admin={admin} name={transaction.delivery.name} product={transaction.product} quantity={transaction.quantity} payment={transaction.payment} status={transaction.status == "completed" ? "success" : "failed"} />
                        )
                    }
                </div>
            ) : null
         }


         {
            transaction.delivery.status == "delivered" && <Button onClick={() => {router.get(route("delivery.confirm", transaction.delivery.id))}}  variant={"theme"} className='w-full'>Konfirmasi Pesanan</Button>
         }
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
