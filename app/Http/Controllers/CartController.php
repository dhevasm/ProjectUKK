<?php

namespace App\Http\Controllers;

use App\Models\cart;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use App\Models\DataUndangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $carts = Cart::with([
            'product',
            'product.product_images',
            'data_undangan',
            'user'
        ])->where('user_id', Auth::user()->id)->get();
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/CartPage', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' => Setting::all(),
            'categories' => Category::all(),
            'carts' => $carts,
            "role" =>  $role,
            "admin" => $admin,
        ]);
    }

    public function search(Request $request){
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $request->validate([
            'q' => 'required|string'
        ]);

        $carts = Cart::where('user_id', Auth::user()->id)
                ->whereHas('product', function($query) use ($request) {
                $query->where('name', 'like', '%' . $request->q . '%');
                })->with([
                    'product',
                    'product.product_images',
                    'data_undangan',
                    'user'
                ])->get();
        return Inertia::render('Client/CartPage', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' => Setting::all(),
            'categories' => Category::all(),
            'carts' => $carts,
            "role" =>  $role,

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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

        cart::create([
            "user_id" => $user_id,
            "product_id" => $request->product_id,
            "data_undangan_id" => $dataUndangan_id,
            "quantity" => $request->quantity,
        ]);

        return redirect()->back();
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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
            "product_id" => "required|integer",
        ]);

        $dataUndangan = DataUndangan::find($id)->update([
            "bride_name" => $request->bride_name,
            "bride_father_name" => $request->bride_father_name,
            "bride_mother_name" => $request->bride_mother_name,
            "groom_name" => $request->groom_name,
            "groom_father_name" => $request->groom_father_name,
            "groom_mother_name" => $request->groom_mother_name,
            "location" => $request->location,
            "akad" => $request->akad,
            "resepsi" => $request->resepsi,
            "note" => $request->note,
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cart = cart::find($id);

        if(!$cart){
            return redirect()->route("cart.index")->withErrors("Cart Not Found");
        }

        $data_udangan = DataUndangan::find($cart->data_undangan_id);
        $data_udangan->delete();

        $cart->delete();

        return redirect()->route("cart.index");
    }

    public function changeQuantity(Request $request,string $id){
        $request->validate([
            "quantity" => "numeric|required"
        ]);

        $cart = cart::find($id);
        $product = Product::find($cart->product_id);

        if($request->quantity < $product->min_order){
            return redirect()->route("cart.index")->withErrors("product minimal is " . $product->min_order);
        }

        if($request->quantity > $product->stock){
            return redirect()->route("cart.index")->withErrors("product stock is " . $product->stock);
        }

        $cart->update([
            "quantity" => $request->quantity
        ]);

        return redirect()->route("cart.index");
    }
}
