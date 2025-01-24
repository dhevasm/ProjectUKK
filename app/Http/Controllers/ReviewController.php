<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(){
        $reviews = review::with(['user', 'product'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Tables/ReviewTable/ReviewTable', compact('reviews'));
    }

    public function store(Request $request){
        $request->validate([
            "product_id" => "required|integer",
            "rating" => "required|integer",
            "comment" => "required|string",
        ]);


        review::create([
            "user_id" => Auth::user()->id,
            "product_id" => $request->product_id,
            "rating" => $request->rating,
            "comment" => $request->comment,
        ]);

        return redirect()->back();
    }

    public function destroy($id){
        review::find($id)->delete();
        return redirect()->back();
    }
}
