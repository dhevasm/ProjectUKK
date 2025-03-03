<?php

namespace App\Http\Controllers;

use Generator;
use App\Models\cart;
use App\Models\User;
use Inertia\Inertia;
use App\Models\review;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProductImages;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // public static function middleware()
    // {
    //     return [
    //         'admin'=> ['except' => ['show', 'search',]],
    //     ];
    // }


    public function index()
    {
        $products = Product::with("category")->get();
        $totalTrash = Product::onlyTrashed()->count();
        return Inertia::render('Tables/ProductTable/ProductTable', compact("products", "totalTrash"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Tables/ProductTable/AddProduct', compact("categories"));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string",
            "category_id" => "required|integer",
            "price" => "required|integer",
            "stock" => "required|integer",
            "min_order" => "required|integer",
            "description" => "required|string",
            "visible" => "required|boolean",
            "images" => "required",
        ]);

        Product::create([
            "name" => $request->name,
            "category_id" => $request->category_id,
            "price" => $request->price,
            "stock" => $request->stock,
            "min_order" => $request->min_order,
            "description" => $request->description,
            "visible" => $request->visible,
        ]);

        $product = Product::latest()->first();

        foreach ($request->images as $image) {
            $fileName = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $filePath = 'storage/images/products/' . $fileName;
            $image->storeAs('images/products/', $fileName, 'public');
            ProductImages::create([
                "product_id" => $product->id,
                "url" => $filePath
            ]);
        }

        return redirect()->route("product.create");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $name)
    {

        $product = Product::with(["category", "product_images"])->where("name", str_replace("-", " ", $name))->first();

        if (!$product || !$product->visible) {
            return redirect()->route("welcome");
        }

        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $settings = Setting::all();
        $categories = Category::all();
        $products = Product::all();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $reviews = review::where("product_id", $product->id)->with("user")->get();
        $isCanReview = false;

        if(Auth::user()){
            $isCanReview = Transaction::where("user_id", Auth::user()->id)->where("product_id", $product->id)->where("status", "completed")->count() > 0 ? true : false;
            if(review::where("user_id", Auth::user()->id)->where("product_id", $product->id)->count() > 0){
                $isCanReview = false;
            }
        }

        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/DetailProduct', compact("admin","product", "canLogin", "canRegister", "settings", "categories", "totalCart", 'role', 'reviews', 'isCanReview'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with("category")->find($id);
        $categories = Category::all();
        $productImages = ProductImages::where("product_id", $id)->get();
        return Inertia::render('Tables/ProductTable/EditProduct', compact("product", "categories", "productImages"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => "required|string",
            "category_id" => "required|integer",
            "price" => "required|integer",
            "stock" => "required|integer",
            "min_order" => "required|integer",
            "description" => "required|string",
            "visible" => "required|boolean",
        ]);

        $product = Product::find($id);
        $product->update([
            "name" => $request->name,
            "category_id" => $request->category_id,
            "price" => $request->price,
            "stock" => $request->stock,
            "min_order" => $request->min_order,
            "description" => $request->description,
            "visible" => $request->visible,
        ]);

        if ($request->images) {
            foreach ($request->images as $image) {
                $fileName = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $filePath = 'storage/images/products/' . $fileName;
                $image->storeAs('images/products/', $fileName, 'public');
                ProductImages::create([
                    "product_id" => $product->id,
                    "url" => $filePath
                ]);
            }
        }

        return redirect()->route("product.edit", $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Product::find($id)->delete();
        return redirect()->route("product.index");
    }

    public function trash(){
        $products = Product::onlyTrashed()->get();
        return Inertia::render('Tables/ProductTable/DeletedProduct', compact("products"));
    }

    public function permanentDelete(string $id)
    {
        $product = Product::withTrashed()->find($id);
        $productImages = ProductImages::where("product_id", $id)->get();
        foreach ($productImages as $image) {
            unlink(public_path($image->url));
            $image->delete();
        }
        $product->forceDelete();
        return redirect()->back();
    }

    public function restore(string $id)
    {
        Product::withTrashed()->find($id)->restore();
        return redirect()->back();
    }

    public function deleteImage(string $name)
    {
        $image = ProductImages::where('url', 'like', '%' . $name . '%')->first();
        unlink(public_path($image->url));
        $image->delete();
        return redirect()->back();
    }

    public function search(Request $request){
        $request->validate([
            'q' => 'required|string'
        ]);

        $Products = Product::where('name', 'like', '%' . $request->q . '%')->with(["product_images", "reviews"])->get();
        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $settings = Setting::all();
        $categories = Category::all();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/Search', compact("admin","canLogin", "canRegister", "settings", "categories", "Products", "totalCart", "role"));
    }
}
