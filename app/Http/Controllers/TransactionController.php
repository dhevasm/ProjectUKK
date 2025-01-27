<?php

namespace App\Http\Controllers;

use App\Models\cart;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use App\Models\Delivery;
use App\Models\Tracking;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Refund;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class TransactionController extends Controller
{

    public function index(){
        $transactions = Transaction::with([
            "user",
            "payment",
            "delivery",
            "product",
            "product.product_images",
            "data_undangan",
        ])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Tables/TransactionTable/TransactionTable', compact('transactions'));
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
        $transaction = Transaction::find($id);
        $transactions = Transaction::where('delivery_id', $transaction->delivery_id)->get();
        $tracking = Tracking::where('delivery_id', $transaction->delivery_id)->first();
        $payment = Payment::find($transaction->payment_id);
        if(isset($tracking)){
            if($status == "proccess" && $payment->status == "settlement"){
                $tracking->update([
                    'proccess' => now(),
                    "status" => "proccess",
                ]);

                foreach($transactions as $trans){
                   $product = Product::find($trans->product_id);
                    $product->stock = $product->stock - $trans->quantity;
                    $product->sold = $product->sold + $trans->quantity;
                    $product->save();
                }

                $this->sendNotif($transaction->user_id, env("APP_NAME").": Pesananmu sudah diproses, silahkan tunggu informasi selanjutnya");
            }

            if($status == "cancelled"){
                $tracking->update([
                    'cancelled' => now(),
                    "status" => "cancelled",
                ]);
                Delivery::find($transaction->delivery_id)->update([
                    'status' => "cancelled",
                ]);
                $this->sendNotif($transaction->user_id, env("APP_NAME").": Pesananmu dibatalkan, silahkan ambil refund melalui website kami");
            }

            if($status == "delivery"){
                $tracking->update([
                    'delivery' => now(),
                    "status" => "delivery",
                ]);
                $this->sendNotif($transaction->user_id, env("APP_NAME").": Pesananmu sudah dikirim, silahkan tunggu informasi selanjutnya");
            }
        }


        if($payment->status != "settlement" && $status != "cancelled"){
            return redirect()->route('transaction.index')->withErrors("Payment not settled yet");
        }
        foreach($transactions as $trans){
            $trans->status = $status;
            $trans->save();
        }

        return redirect()->route('transaction.index');

    }

    public function userIndex(){

        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $categories = Category::all();
        $settings = Setting::all();
        $Products = Product::all();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $transactions = Transaction::where('user_id', Auth::user()->id)->with([
            "user",
            "payment",
            "delivery",
            "product",
            "product.product_images",
            "data_undangan",
        ])->orderBy('created_at', 'desc')->get();

        $deliveries_id = [];

        foreach($transactions as $transaction){
            array_push($deliveries_id, $transaction->delivery->id);
        }


        $refund = Refund::where('user_id', Auth::user()->id)->with("payment")->get();
        $trackings = Tracking::whereIn("delivery_id", $deliveries_id)->get();
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        return Inertia::render('Client/OrderHistory', compact('categories', 'settings', 'Products', 'canLogin', 'canRegister', 'totalCart', 'transactions', 'trackings', 'role', 'refund'));
    }

    public function cancelTransaction(string $id){
        $transaction = Transaction::find($id);
        $transaction->update([
            'status' => "cancelled",
        ]);
        $payment = Payment::where("id", $transaction->payment_id)->first();
        $payment->update([
            'status' => "failed",
        ]);

        return redirect()->route('order.history');
    }

    public function deleteHistory(string $id){
        $transaction = Transaction::find($id);
        $payment = Payment::where("id", $transaction->payment_id)->first();
        $delivery = Delivery::where("id", $transaction->delivery_id)->first();
        $tracking = Tracking::where("delivery_id", $delivery->id)->first();
        if(isset($tracking)){
            $tracking->delete();
        }
        $transaction->delete();
        $payment->delete();
        $delivery->delete();

        return redirect()->route('order.history');
    }
}
