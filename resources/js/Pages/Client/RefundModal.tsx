import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { User } from "@/types";

interface Payment{
    id: string;
    order_id: string;
    snap_token: string;
    user: User;
    payment_method: string;
    gross_amount: number;
    status: string;
}

interface RefundModalProps {
    payment: Payment;
}


export default function RefundModal({ payment } : RefundModalProps) {
    const [reason, setReason] = useState("");
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    const handleRefund = () => {
        router.post(route("refund.store"), {
            payment_id : payment.id.toString(),
            reason : reason,
            no_rekening : accountNumber,
            name : accountName,
            bank : bank
        }, {
            preserveScroll: true,
            onSuccess: () => {
                (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                toast.success("Terkirim!", {
                    description: "Permintaan pengembalian dana berhasil dikirim.",
                });
            },
            onError: (errors: any) => {
                (document.querySelector('[data-state="open"]') as HTMLElement)?.click();
                toast.error("Gagal!", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });

    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" size="lg" variant="theme">
                   Kirim Permintaan Refund
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-4">
                        Kirim Permintaan Refund
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className="mb-1">Order ID</Label>
                        <Input value={payment.order_id} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div>
                        <Label className="mb-1">Total Pembayaran (Gross Amount)</Label>
                        <Input value={`Rp ${payment.gross_amount.toLocaleString('id-ID')}`} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div>
                        <Label className="mb-1">Pilih Alasan Pengembalian</Label>
                        <RadioGroup
                            onValueChange={(value) => setReason(value)}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Dibatalkan oleh admin" id="reason1" />
                                <Label htmlFor="reason1">Dibatalkan oleh admin</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="" id="reason3" />
                                <Label htmlFor="reason3">Alasan lainnya</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Label className="mb-1">Alasan Pengembalian Dana</Label>
                        <Textarea
                            placeholder="Jelaskan alasan pengembalian dana..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="resize-none"
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 ">
                        <div className="w-full">
                            <Label className="mb-1">No Rekening</Label>
                            <Input type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required/>
                        </div>
                        <div className="w-full">
                            <Label className="mb-1">Nama</Label>
                            <Input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}  required/>
                        </div>
                        <div className="w-full">
                            <Label className="mb-1">Jenis Bank</Label>
                            <Input type="text" value={bank} onChange={(e) => setBank(e.target.value)} required/>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">Kebijakan Pengembalian Dana</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                            <li>Pengembalian dana dikenakan potongan sebesar Rp. 10.000 sebagai biaya administrasi.</li>
                            <li>Proses pengembalian dana akan memakan waktu 5-7 hari kerja.</li>
                            <li>Biaya transaksi tidak dapat dikembalikan.</li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button onClick={handleRefund} variant="theme">Ajukan Refund</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
