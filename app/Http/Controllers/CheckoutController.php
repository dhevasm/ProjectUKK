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
use App\Models\DataUndangan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class CheckoutController extends Controller
{
    public function index(Request $request){

        $request->validate([
            "ids" => "required|array",
        ]);

        if(Auth::user() == null){
            return redirect()->route('login');
        }

        if(Auth::user()->address == null || Auth::user()->phone == null || Auth::user()->coordinates == null || Auth::user()->phone_verified_at == null){
            return redirect()->back()->withErrors("Please complete your profile first");
        }

        if(cart::where("user_id", Auth::user()->id)->wherein("id", $request->ids)->count() == 0){
            return redirect()->back();
        }

        $items = cart::whereIn("id", $request->ids)->with(["product", "product.product_images", "data_undangan"])->get();
        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $categories = Category::all();
        $settings = Setting::all();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $Products = Product::all();
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';

        return Inertia::render('Client/CheckoutPage', compact("items",'categories', 'settings', 'Products', 'canLogin', 'canRegister', 'totalCart', "role"));
    }

    private function generateOrderId() {
        return 'ORDER-' . uniqid();
    }

    public function store(Request $request){
        $request->validate([
            "ids" => "required|array",
            "total" => "required|numeric",
            "phone" => "required|string",
            "name" => "required|string",
        ]);

        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION');
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        $orderId = $this->generateOrderId();

        $items = cart::where("user_id", Auth::user()->id)->whereIn("id", $request->ids)->with(["product", "product.product_images", "data_undangan"])->get();

        $productionPrice = Setting::where("key", "production_price")->first();
        $deliveryPrice = Setting::where("key", "delivery_price")->first();
        $tax = Setting::where("key", "tax")->first();
        $hargaBersih = 0;

        $productsDetail = [];
        foreach($items as $item){
            $productsDetail[] = [
                'id' => $item->product->id,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'total' => $item->product->price * $item->quantity,
                'name' => $item->product->name,
            ];

            $hargaBersih += $item->product->price * $item->quantity;
        }

        if($productionPrice){
            $productsDetail[] = [
                'id' => 'production_price',
                'price' => $productionPrice->value,
                'quantity' => 1,
                'total' => $productionPrice->value,
                'name' => 'Production Price',
            ];
        }

        if($deliveryPrice){
            $productsDetail[] = [
                'id' => 'delivery_price',
                'price' => $deliveryPrice->value,
                'quantity' => 1,
                'total' => $deliveryPrice->value,
                'name' => 'Delivery Price',
            ];
        }

        if($tax){
            $productsDetail[] = [
                'id' => 'tax ' . $tax->value . '%',
                'price' => $hargaBersih * ($tax->value / 100),
                'quantity' => 1,
                'total' => $hargaBersih * ($tax->value / 100),
                'name' => 'Tax',
            ];
        }


        $grossAmount = $request->total;

        $params = array(
            'transaction_details' => array(
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ),
            'item_details' => $productsDetail,
            'customer_details' => array(
                'first_name' =>Auth::user()->name,
                'email' => Auth::user()->email,
            ),
        );

        $snapToken = \Midtrans\Snap::getSnapToken($params);

        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $categories = Category::all();
        $settings = Setting::all();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $Products = Product::all();
        return Inertia::render('Client/CheckoutPage', compact("items",'categories', 'settings', 'Products', 'canLogin', 'canRegister', 'totalCart', 'snapToken', 'orderId'));
    }

    private function sendNotif(){
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
        'target' => User::find(1)->phone,
        'message' => env("APP_NAME").': Ada pesanan baru, segera cek website untuk melihat pesanan.',
        'countryCode' => '62',
        ),
        CURLOPT_HTTPHEADER => array(
            'Authorization: '. env('FONTTE_TOKEN')
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
    }

    public function createPayment(Request $request){
        $request->validate([
            "ids" => "required|array",
            "total" => "required|numeric",
            "phone" => "required|string",
            "name" => "required|string",
            'order_id' => 'required|string',
            'method' => 'required|string',
            'status' => 'required|string',
            'snap_token' => 'required|string',
        ]);

        $paymentStatus = $request->status;

        if($request->status == "capture"){
            $paymentStatus = "settlement";
        }

        $pendingPayment = Payment::where("order_id", $request->order_id)->first();

        if($paymentStatus == 'settlement' && isset($pendingPayment)){
            $pendingPayment->update([
                'status' => $paymentStatus,
            ]);

            $payment = Payment::where("order_id", $request->order_id)->first();
            $delivery_id = Transaction::where("payment_id", $payment->id)->first()->delivery_id;
            Tracking::create([
                'delivery_id' => $delivery_id,
                'ordered' => now(),
                'status' => 'pending',
            ]);

        }elseif(isset($pendingPayment)){
            $pendingPayment->update([
                'status' => $paymentStatus,
            ]);

            if($request->status != "settlement" && $request->status != "pending"){
                Transaction::where("payment_id", $pendingPayment->id)->update([
                    'status' => 'cancelled',
                ]);
            }
        }
        elseif($paymentStatus == 'settlement' || $paymentStatus == 'pending'){
            $payment = Payment::create([
                'order_id' => $request->order_id,
                'snap_token' => $request->snap_token,
                'user_id' => Auth::user()->id,
                'gross_amount' => $request->total,
                'payment_method' => $request->method,
                'status' => $paymentStatus,
            ]);

            $delivery =  Delivery::create([
                'user_id' => Auth::user()->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => Auth::user()->address,
                'coordinate' => Auth::user()->coordinates,
                'status' => 'pending',
            ]);

            if($paymentStatus == 'settlement'){
                Tracking::create([
                    'delivery_id' => $delivery->id,
                    'ordered' => now(),
                    'status' => 'pending',
                ]);
            }

            $items = cart::where("user_id", Auth::user()->id)->whereIn("id", $request->ids)->with(["product", "product.product_images", "data_undangan"])->get();

            foreach($items as $item){
                Transaction::create([
                    "payment_id" => $payment->id,
                    "delivery_id" => $delivery->id,
                    'user_id' => Auth::user()->id,
                    'product_id' => $item->product_id,
                    'data_undangan_id' => $item->data_undangan_id,
                    'quantity' => $item->quantity,
                    'status' => 'pending',
                ]);
                $cart = cart::find($item->id);
                $cart->delete();
            }
        }else{
            $payment = Payment::create([
                'order_id' => $request->order_id,
                'snap_token' => $request->snap_token,
                'user_id' => Auth::user()->id,
                'gross_amount' => $request->total,
                'status' => $paymentStatus,
            ]);
        }


        if($paymentStatus == 'settlement'){
            $this->sendNotif();
        }

        return redirect()->route('payment.status', $request->order_id);
    }

    public function paymentStatus(string $id){
        $payment = Payment::where("order_id", $id)->first();

        if(!isset($payment)){
            return redirect()->route('welcome');
        }

        $status = "";

        if($payment->status == 'settlement'){
            $status = "success";
        }elseif($payment->status == 'pending'){
            $status = "pending";
        }else{
            $status = "error";
        }

        $amount = $payment->gross_amount;
        $date = $payment->updated_at;
        $method = $payment->payment_method;
        $id = $payment->order_id;

        return Inertia::render('Client/PaymentStatus', compact('status', 'amount', 'date', 'method', 'id'));
    }

    public function buyNow(Request $request){
        $request->validate([
            "bride_name" => "required|string",
            "bride_father_name" => "required|string",
            "bride_mother_name" => "required|string",
            "groom_name" => "required|string",
            "groom_father_name" => "required|string",
            "groom_mother_name" => "required|string",
            "location" => "required|string",
            "akad" => "required|date",
            "resepsi" => "required|date",
            "quantity" => "required|integer",
            "product_id" => "required|integer",
        ]);

        if(Auth::user() == null){
            return redirect()->route('login');
        }

        if(Auth::user()->address == null || Auth::user()->phone == null || Auth::user()->coordinates == null || Auth::user()->phone_verified_at == null){
            return redirect()->back()->withErrors("Please complete your profile first: phone & address on profile");
        }

        $user_id = Auth::user()->id;

        $product = Product::find($request->product_id);
        if($product->stock < $request->quantity){

            return redirect()->back()->withErrors('message', 'Stock product is not enough');
        }
        if($product->min_order > $request->quantity){
            return redirect()->back()->withErrors('message', "Minimum order is ".$product->min_order);
        }

        $dataUndangan = DataUndangan::create([
            "bride_name" => $request->bride_name,
            "bride_father_name" => $request->bride_father_name,
            "bride_mother_name" => $request->bride_mother_name,
            "groom_name" => $request->groom_name,
            "groom_father_name" => $request->groom_father_name,
            "groom_mother_name" => $request->groom_mother_name,
            "location" => $request->location,
            "akad" => $request->akad,
            "resepsi" => $request->resepsi,
        ]);

        if(isset($request->note)){
            $dataUndangan->note = $request->note;
            $dataUndangan->save();
        }

        $dataUndangan_id = $dataUndangan->id;

        $cart = cart::create([
            "user_id" => $user_id,
            "product_id" => $request->product_id,
            "data_undangan_id" => $dataUndangan_id,
            "quantity" => $request->quantity,
        ]);

        $items = $cart->with(["product", "product.product_images", "data_undangan"])->get();
        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $categories = Category::all();
        $settings = Setting::all();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $Products = Product::all();
        return Inertia::render('Client/CheckoutPage', compact("items",'categories', 'settings', 'Products', 'canLogin', 'canRegister', 'totalCart'));
    }
}

