<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Delivery;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Can;

class DashboardController extends Controller
{
    public function index(){
        $totalUser =  User::all()->count();
        $productsSold = Transaction::wherein("status",["completed","proccess", "delivery"])->sum("quantity");
        $revenue = Payment::all()->sum("gross_amount");

        $deliveryTransactions = Transaction::where("status", "delivery")->get();
        $deliveryIds = $deliveryTransactions->pluck('delivery_id')->unique();
        $deliveries = Delivery::whereIn('id', $deliveryIds)->where("status", "pending")->count();
        $statuses = ['pending', 'process',  'delivery', 'completed',  'cancelled'];
        $transactionsByStatus = collect($statuses)->map(function ($status) {
            return [
            'status' => $status,
            'count' => Transaction::where('status', $status)->count()
            ];
        })->toArray();

        $monthlyRevenue = collect(range(1, 12))->mapWithKeys(function ($month) {
            $total = Payment::whereYear('created_at', now()->year)
                    ->whereMonth('created_at', $month)
                    ->sum('gross_amount');
            return [$month => $total];
        })->toArray();

        $monthlyProductsSold = collect(range(1, 12))->mapWithKeys(function ($month) {
            $total = Transaction::whereYear('created_at', now()->year)
                ->whereMonth('created_at', $month)
                ->wherein("status",["completed","proccess", "delivery"])
                ->sum('quantity');
            return [$month => $total];
        })->toArray();


        return Inertia::render('Dashboard', compact("totalUser", "productsSold", "revenue", "deliveries", 'transactionsByStatus', 'monthlyRevenue', 'monthlyProductsSold'));
    }
}
