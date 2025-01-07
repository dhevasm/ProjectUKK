<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Can;

class DashboardController extends Controller
{
    public function index(){

        return Inertia::render('Dashboard');
    }
}
