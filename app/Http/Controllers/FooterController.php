<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Mail\feedback;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

class FooterController extends Controller
{
    public function about(){
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/About', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' =>Setting::all(),
            'categories' =>Category::all(),
            'products' => Product::all(),
            "totalCart" => Auth::user() ? Auth::user()->carts->count() : 0,
            "role" =>  $role,
            "admin" => $admin
        ]);
    }
    public function feedback(){
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/Feedback', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' =>Setting::all(),
            'categories' =>Category::all(),
            'products' => Product::all(),
            "totalCart" => Auth::user() ? Auth::user()->carts->count() : 0,
            "role" =>  $role,
            "admin" => $admin
        ]);
    }

    public function feedbackStore(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'subject' => 'required|string',
            'type' => 'required|string',
            'message' => 'required|string',
        ]);

        Mail::to('dhevasm2019@gmail.com')->send(new Feedback($validatedData));

        return redirect()->route("feedback")->with('success', 'Feedback sent successfully!');
    }

    public function kebijakan(){
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/Kebijakan', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' =>Setting::all(),
            'categories' =>Category::all(),
            'products' => Product::all(),
            "totalCart" => Auth::user() ? Auth::user()->carts->count() : 0,
            "role" =>  $role,
            "admin" => $admin
        ]);
    }
    public function help(){
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Client/Help', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' =>Setting::all(),
            'categories' =>Category::all(),
            'products' => Product::all(),
            "totalCart" => Auth::user() ? Auth::user()->carts->count() : 0,
            "role" =>  $role,
            "admin" => $admin
        ]);
    }
}
