import { useState } from "react";
import { Product, User, dataUndangan } from "@/types";
import { Separator } from '@/Components/ui/separator';
import { Check, Clock, XCircle, CreditCard, Receipt, ChevronRight, CreditCardIcon, HandCoins } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

type PaymentStatusType = 'success' | 'pending' | 'error' | "refund";

interface StatusConfig {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon: JSX.Element;
  label: string;
  description: string;
}

interface Payment{
    id: string;
    order_id: string;
    snap_token: string;
    user: User;
    payment_method: string;
    gross_amount: number;
    status: string;
    created_at: string;
}

interface PaymentStatusProps {
  payment: Payment;
}

const getStatusConfig = (status: PaymentStatusType): StatusConfig => {
    const configs: Record<PaymentStatusType, StatusConfig> = {
      success: {
        backgroundColor: 'bg-green-50 dark:bg-green-900/30',
        textColor: 'text-green-800 dark:text-green-300',
        borderColor: 'border-green-100 dark:border-green-800',
        icon: <Check className="w-6 h-6 text-green-600 dark:text-green-400" />,
        label: 'Pembayaran Berhasil',
        description: 'Pmbayaran telah berhasil'
      },
      pending: {
        backgroundColor: 'bg-yellow-50 dark:bg-yellow-900/30',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        borderColor: 'border-yellow-100 dark:border-yellow-800',
        icon: <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
        label: 'Menunggu Pembayaran',
        description: 'Pembayaran masih tertunda'
      },
      error: {
        backgroundColor: 'bg-red-50 dark:bg-red-900/30',
        textColor: 'text-red-800 dark:text-red-300',
        borderColor: 'border-red-100 dark:border-red-800',
        icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
        label: 'Pembayaran Gagal',
        description: 'Error saat pembayaran'
      },
      refund:{
        backgroundColor: 'bg-blue-50 dark:bg-blue-900/30',
        textColor: 'text-blue-800 dark:text-blue-300',
        borderColor: 'border-blue-100 dark:border-blue-800',
        icon: <HandCoins className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
        label: 'Refund',
        description: 'Dana Telah di Kembalikan'
      }
    };
    return configs[status];
  };

const PaymentStatusModal : React.FC<PaymentStatusProps> = ({
 payment
}) => {
  const config = getStatusConfig(payment.status == "settlement" ? "success" : payment.status == "pending" ? "pending" : payment.status == "refund" ? "refund" : "error");
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600"
                >
                    {payment.status == "settlement" ? <Check className="h-4 w-4" /> : payment.status == "pending" ? <Clock className="h-4 w-4" /> : payment.status == "refund" ? <HandCoins className="h-4 w-4" />   : <XCircle className="h-4 w-4" /> }
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Payment Status
                    </DialogTitle>
                </DialogHeader>
                <div className={`rounded-lg border ${config.backgroundColor} ${config.borderColor} p-4 mb-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${config.backgroundColor}`}>
              {config.icon}
            </div>
            <div>
              <h3 className={`font-semibold ${config.textColor}`}>
                {config.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Pembayaran</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Rp {payment.gross_amount.toLocaleString('id-ID')}
            </p>
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          {/* Payment Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Receipt className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">{payment.order_id}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Metode</p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">{payment.payment_method}</p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Transaksi</p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(payment.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
            </DialogContent>
        </Dialog>
    );
}

export default PaymentStatusModal;
