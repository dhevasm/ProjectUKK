import React from 'react';
import { Check, Clock, XCircle, CreditCard, Receipt, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

type PaymentStatusType = 'success' | 'pending' | 'error';

interface StatusConfig {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon: JSX.Element;
  label: string;
  description: string;
}

interface PaymentStatusProps {
  status: PaymentStatusType;
  amount: number;
  date: string;
  method: string;
  id: string;
}

const getStatusConfig = (status: PaymentStatusType): StatusConfig => {
  const configs: Record<PaymentStatusType, StatusConfig> = {
    success: {
      backgroundColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-300',
      borderColor: 'border-green-100 dark:border-green-800',
      icon: <Check className="w-6 h-6 text-green-600 dark:text-green-400" />,
      label: 'Pembayaran Berhasil',
      description: 'Transaksi Anda telah berhasil diproses'
    },
    pending: {
      backgroundColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      borderColor: 'border-yellow-100 dark:border-yellow-800',
      icon: <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      label: 'Menunggu Pembayaran',
      description: 'Silakan selesaikan pembayaran Anda'
    },
    error: {
      backgroundColor: 'bg-red-50 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-300',
      borderColor: 'border-red-100 dark:border-red-800',
      icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
      label: 'Pembayaran Gagal',
      description: 'Mohon coba lagi atau gunakan metode pembayaran lain'
    }
  };
  return configs[status];
};

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  amount,
  date,
  method,
  id
}) => {
  const config = getStatusConfig(status);

    useEffect(() => {
              const savedMode = localStorage.getItem('darkMode');
              if (savedMode === 'true') {
                  document.documentElement.classList.add('dark');
              } else {
                  document.documentElement.classList.remove('dark');
              }
          }, []);

  return (
    <Card className="w-full mt-20 max-w-md mx-auto bg-white dark:bg-customDark2 shadow-lg dark:shadow-gray-900/50">
    <Head title={"Payment Status"} />
      <CardContent className="p-6">
        {/* Status Header */}
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
              Rp {amount.toLocaleString('id-ID')}
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
              <p className="font-medium text-gray-900 dark:text-white">{id}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Metode</p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">{method}</p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Transaksi</p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(date).toLocaleDateString('id-ID', {
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

          {/* Action Button */}
          <Button
            className="w-full mt-4 flex items-center justify-between"
            variant={status === 'error' ? 'destructive' : 'theme'}
            onClick={() => router.get(route('order.history'))}
          >
                Lihat Detail Transaksi
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
