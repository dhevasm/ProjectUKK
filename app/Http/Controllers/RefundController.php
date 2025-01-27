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
        $refunds = Refund::with(['user', 'payment'])->orderBy('created_at', 'asc')->get();
        return Inertia::render('Tables/RefundTable/RefundTable', compact('refunds'));
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


    public function store(Request $request){
        $request->validate([
            'payment_id' => 'required|string',
            'reason' => 'required|string',
            "no_rekening" => "required|numeric",
            "name" => "required|string",
            "bank" => "required|string",
        ]);

        $user_id = Auth::user()->id;

        if(Refund::where('payment_id', $request->payment_id)->exists()){
            return redirect()->back()->withErrors('Refund request already exists');
        }

        Refund::create([
            'user_id' => $user_id,
            'payment_id' => $request->payment_id,
            'reason' => $request->reason,
            'no_rekening' => $request->no_rekening,
            'name' => $request->name,
            'bank' => $request->bank,
            'status' => 'pending'
        ]);

        $this->sendNotif(1, env("APP_NAME") . ': Ada permintaan refund baru');

        return redirect()->back();
    }



    public function changeStatus(Request $request, $id){
        $request->validate([
            'status' => 'required|string',
        ]);

        $refund = Refund::find($id);
        if($request->status == "approved"){
            $payment = Payment::find($refund->payment_id);
            $payment->status = "refund";
            $payment->save();
            $this->sendNotif($refund->user_id, env("APP_NAME") . ': Permintaan refund diterima. telah berhasil transfer ke rekening '. $refund->no_rekening . ' a/n '. $refund->name . ' ('. $refund->bank .')');
        }
        $refund->status = $request->status;
        if($request->status == "rejected" && isset($request->message)){
            $refund->message = $request->message;
            $this->sendNotif($refund->user_id, env("APP_NAME") . ": Perminataan refund ditolak. alasan : ". $request->message);
        }
        $refund->save();
        return redirect()->back();
    }
}
