<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Can;

class DashboardController extends Controller
{
    public function index(){
        $totalUser =  User::all()->count();
        $productsSold = Transaction::all()->sum("quantity");
        $revenue = Payment::all()->sum("gross_amount");
        $deliveries = Delivery::where("status", "pending")->count();

        return Inertia::render('Dashboard', compact("totalUser", "productsSold", "revenue", "deliveries"));
    }
}
