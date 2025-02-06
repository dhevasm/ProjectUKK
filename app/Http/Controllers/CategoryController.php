<?php

namespace App\Http\Controllers;

use App\Models\cart;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        return Inertia::render('Tables/CategoryTable/CategoryTable', compact('categories'));
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
            'name' => 'required|string',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        if($request->hasFile('image')) {
            $fileName = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();
            $filePath = 'storage/images/categories/' . $fileName;
            $request->file('image')->storeAs('images/categories/', $fileName, 'public');
        }

        Category::create([
            'name' => $request->name,
            'image' => $filePath ?? null,
        ]);

        return redirect()->route('category.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $name)
    {
        $category = Category::where('name', str_replace("-", " ", $name))->first();

        if (!$category) {
            return redirect()->route("welcome");
        }

        $canLogin = Route::has('login');
        $canRegister = Route::has('register');
        $categories = Category::all();
        $settings = Setting::all();
        $Products = Product::where("category_id", $category->id)->with(['category', 'product_images', 'reviews'])->get();
        $totalCart = Auth::user() ? cart::where("user_id", Auth::user()->id)->count() : 0;
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/DetailCategory', compact('admin','category', 'categories', 'settings', 'Products', 'canLogin', 'canRegister', 'totalCart', "role"));
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
        $category = Category::find($id);

        $request->validate([
            'name' => 'required|string',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        if($request->hasFile('image')) {
            unlink(public_path($category->image));
            $fileName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $filePath = 'storage/images/categories/' . $fileName;
            $request->file('image')->storeAs('images/categories/', $fileName, 'public');
        }

        $category->update([
            'name' => $request->name,
            'image' => $filePath ?? $category->image,
        ]);

        return redirect()->route('category.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        unlink(public_path($category->image));
        $category->delete();
        return redirect()->route('category.index');
    }
}
