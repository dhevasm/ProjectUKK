import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/Components/ui/dialog";
import {
  Receipt,
  Download,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Product } from '@/types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type SummaryProps = {
  product: Product;
  quantity: number;
  payment: {
    order_id: string;
    gross_amount: number;
  },
  status: 'success' | 'failed';
};

const Summary = ({
  product,
  quantity,
  payment,
  status
}: SummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setDrawColor(230, 232, 235);
    doc.line(0, 50, pageWidth, 50);

    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);
    doc.text('Transaction Summary', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Order ID: ${payment.order_id}`, pageWidth / 2, 35, { align: 'center' });

    const statusText = `Status: ${status.toUpperCase()}`;
    doc.setFontSize(12);
    doc.setTextColor(status === 'success' ? '#059669' : '#DC2626');
    doc.text(statusText, pageWidth / 2, 45, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Product Details', 15, 70);

    doc.autoTable({
      startY: 80,
      head: [['Product Information', '']],
      body: [
        ['Name', product.name],
        ['Unit Price', `Rp. ${product.price.toLocaleString('id-ID')}`],
        ['Quantity', quantity.toString()]
      ],
      theme: 'plain',
      styles: {
        fontSize: 12,
        textColor: [30, 41, 59],
        cellPadding: 8
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [30, 41, 59],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 15, right: 15 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.text('Payment Summary', 15, finalY);

    doc.autoTable({
      startY: finalY + 10,
      body: [
        ['Subtotal', `Rp. ${(product.price * quantity).toLocaleString('id-ID')}`],
        ['Additional Cost', `Rp. ${(payment.gross_amount - (product.price * quantity)).toLocaleString('id-ID')}`],
        ['Total Payment', `Rp. ${payment.gross_amount.toLocaleString('id-ID')}`]
      ],
      theme: 'plain',
      styles: {
        fontSize: 12,
        textColor: [30, 41, 59],
        cellPadding: 8
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 'auto', fontStyle: 'bold' }
      },
      margin: { left: 15, right: 15 }
    });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for your purchase!', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

    doc.save(`transaction_summary_${payment.order_id}.pdf`);
  };

  return (
    <>
      <Button
        title='Transaction Summary'
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white text-sm rounded h-8">
        <Receipt />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
              {status === 'success' ? (
                <CheckCircle2 className="text-green-500 h-7 w-7" />
              ) : (
                <XCircle className="text-red-500 h-7 w-7" />
              )}
              <span>Transaction Summary</span>
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Order ID: {payment.order_id}
            </DialogDescription>
          </DialogHeader>

          <Card className="border-2">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2">
                  <img
                    src={product.product_images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 line-clamp-2">{product.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    Unit Price
                    <p className="text-lg font-semibold text-foreground">
                      Rp. {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed my-4"></div>

              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${
                  status === 'success' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <span className={`font-bold ${
                      status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      Rp. {(product.price * quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Additional Cost</span>
                    <span className="font-medium">
                      Rp. {(payment.gross_amount - (product.price * quantity)).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Payment</span>
                    <span className="font-bold text-lg">
                      Rp. {payment.gross_amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full gap-2 font-semibold"
                variant={"theme"}
                size="sm"
              >
                <Download size={18} />
                Download PDF Summary
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Summary;
