<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Refund;
use App\Models\Payment;
use Midtrans\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    public function index(){
        $refunds = Refund::with('user')->orderBy('created_at', 'asc')->get();
        return Inertia::render('Tables/RefundTable/RefundTable', compact('refunds'));
    }

    public function store(Request $request){
        $request->validate([
            'order_id' => 'required|string',
            'reason' => 'required|string',
        ]);

        $user_id = Auth::user()->id;

        if(Refund::where('order_id', $request->order_id)->exists()){
            return redirect()->back()->withErrors('Refund request already exists');
        }

        Refund::create([
            'user_id' => $user_id,
            'order_id' => $request->order_id,
            'reason' => $request->reason,
            'status' => 'pending'
        ]);

        return redirect()->back();
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


    private function midtransRefund($orderId){
        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION');
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        $amount = Payment::where('order_id', $orderId)->first()->gross_amount;

        try {
            $params = [
                'refund_key' => 'refund-' . $orderId . '-' . time(),
                'amount' => $amount > 10000 ? $amount - 10000 : $amount,
                'reason' => 'Customer requested refund'
            ];

            $response = Transaction::refund($orderId, $params);

            return $response;
        } catch (\Exception $e) {
           return $e->getMessage();
        }
    }


    public function changeStatus(Request $request, $id){
        $request->validate([
            'status' => 'required|string',
        ]);

        $refund = Refund::find($id);
        if($request->status == "approved"){
            // return response()->json($refund->order_id);
            return response()->json($this->midtransRefund($refund->order_id));
        }
        $refund->status = $request->status;
        if(isset($request->message)){
            $this->sendNotif($refund->user_id, $request->message);
        }
        $refund->save();

        return redirect()->back();
    }
}
