<?php

namespace App\Http\Controllers;

use Generator;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProductImages;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
    public function show(string $id)
    {
        //
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
}
