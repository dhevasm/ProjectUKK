<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Delivery;
use App\Models\Tracking;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function index(){
        $deliveries_id = [];
        $transactions = Transaction::where("status", "delivery")->get();
        foreach($transactions as $transaction){
            array_push($deliveries_id, $transaction->delivery_id);
        }
        $delivery = Delivery::wherein("id", $deliveries_id)->with('user')->orderBy('created_at', 'asc')->get();
        return Inertia::render('Tables/DeliveryTable/DeliveryTable', compact('delivery'));
    }

    private function sendNotif($userId, $message){
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.fonnte.com/send',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => array(
        'target' => User::find($userId)->phone,
        'message' => $message,
        'countryCode' => '62',
        ),
        CURLOPT_HTTPHEADER => array(
            'Authorization: '. env('FONTTE_TOKEN')
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
    }

    public function changeStatus(string $status, int $id){
        $delivery = Delivery::find($id);

        $tracking = Tracking::where('delivery_id', $id)->first();
        if(isset($tracking) && $status == "delivered"){
            $tracking->update([
                'delivered' => now(),
                "status" => "delivered",
            ]);

            $this->sendNotif($delivery->user_id, env("APP_NAME").": Pesanan anda telah sampai. Periksa kelengkapan pesanan dan konfirmasi melalui : ".route('order.history'));
        }

        $delivery->update([
            'status' => $status,
        ]);

        return redirect()->route('delivery.index');
    }

    public function confirmDelivery(string $id){

        $delivery = Delivery::find($id);
        $delivery->update([
            'status' => "completed",
        ]);
        $this->sendNotif($delivery->user_id, env("APP_NAME").": Pesanan anda telah selesai. Anda dapat memberikan ulasan terkait layanan kami dan terima kasih telah berbelanja.");

        $tracking = Tracking::where('delivery_id', $id)->first();
        $tracking->update([
            'completed' => now(),
            "status" => "completed",
        ]);

        $transaction = Transaction::where('delivery_id', $id)->get();
        foreach($transaction as $trans){
            $trans->update([
                'status' => "completed",
            ]);
        }

        return redirect()->route('order.history');

    }
}
