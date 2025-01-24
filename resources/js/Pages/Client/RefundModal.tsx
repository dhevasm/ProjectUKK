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

interface RefundModalProps {
    orderId: string;
    grossAmount: number;
}


export default function RefundModal({ orderId, grossAmount } : RefundModalProps) {
    const [reason, setReason] = useState("");

    const handleRefund = () => {
        router.post(route("refund.store"), {
            order_id : orderId,
            reason : reason,
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
                    Pengembalian Dana
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-4">
                        Kirim Permintaan Pengembalian Dana
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className="mb-1">Order ID</Label>
                        <Input value={orderId} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div>
                        <Label className="mb-1">Total Pembayaran (Gross Amount)</Label>
                        <Input value={`Rp ${grossAmount.toLocaleString('id-ID')}`} readOnly className="bg-gray-100 cursor-not-allowed" />
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
