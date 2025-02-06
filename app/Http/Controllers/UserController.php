<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Otp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use PDO;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function rootPage()
    {
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        $admin = User::find(1, ['email', 'phone', 'address']);
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' => Setting::all(),
            'categories' => Category::all(),
            'products' => Product::with(['category', 'product_images', 'reviews'])->get(),
            "totalCart" => Auth::user() ? Auth::user()->carts->count() : 0,
            "role" =>  $role,
            "admin" => $admin
        ]);
    }

    public function index()
    {
        $users = User::with('roles')->get();
        return Inertia::render('Tables/UserTable/UserTable', compact('users'));
    }

    public function googleOauthHandle(Request $request){
        $request->validate([
            "name" => "string|required",
            "email" => "string|required|email",
            "picture" => 'required',
            "password" => "string|required",
        ]);

        $user = User::where('email', $request->email)->first();
        if(!$user){
            $user = User::create([
                "name" => $request->name,
                "email" => $request->email,
                "image" => $request->picture,
                "password" => bcrypt($request->password),
            ]);
        }else{
           Auth::login($user);

           if($user->banned_until && $user->banned_until > now()) {
            $id = $user->id;
            Auth::guard('web')->logout();
           return redirect()->route('user.banned', $id);
        }
           return redirect()->route('welcome');
        }

        Auth::login($user);
        $user->sendEmailVerificationNotification();
        return redirect()->route('verification.notice');
    }

    public function sendOTP($code){
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
        'target' => Auth::user()->phone,
        'message' => env("APP_NAME").': Your One-Time Password (OTP) code is ' . $code . '. Please use this code to verify your phone number. The code will expire in 5 minutes.',
        'countryCode' => '62',
        ),
        CURLOPT_HTTPHEADER => array(
            'Authorization: '. env('FONTTE_TOKEN')
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
    }

    public function createOTP(){
        if(!Auth::user()->phone){
            return redirect()->route('user.profile');
        }

        if(Auth::user()->phone_verified_at){
            return redirect()->route('user.profile');
        }

        $otp = Otp::where('user_id', Auth::user()->id)->first();
        if($otp){
            if($otp->expired_at > now()){
                $this->sendOTP($otp->code);
            }else{
                $otp->delete();
                $otp = Otp::create([
                    'user_id' => Auth::user()->id,
                    'code' => rand(100000, 999999),
                    'expired_at' => now()->addMinutes(5),
                ]);
                $this->sendOTP($otp->code);
            }
        }else{
            $otp = Otp::create([
                'user_id' => Auth::user()->id,
                'code' => rand(100000, 999999),
                'expired_at' => now()->addMinutes(5),
            ]);
            $this->sendOTP($otp->code);
        }

        return redirect()->route('phone-verify');
    }

    public function verifyOTP(Request $request){
        $request->validate([
            'code' => 'required|string'
        ]);

        $otp = Otp::where('user_id', Auth::user()->id)->first();
        if($otp){
            if($otp->expired_at < now()){
                return redirect()->route('phone-verify')->withErrors(['code' => 'OTP expired']);
            }else{
                if($otp->code == $request->code){
                    $otp->delete();
                    User::where('id', Auth::user()->id)->update([
                        'phone_verified_at' => now()
                    ]);
                    return redirect()->route('phone-verify');
                }else{
                    return redirect()->route('phone-verify')->withErrors(['code' => 'Invalid OTP']);
                }
            }
        }else{
            return redirect()->route('phone-verify')->withErrors(['code' => 'OTP not found']);
        }


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
        //
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
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'address' => 'required|string',
        ]);

        User::where('id', $id)->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        return redirect()->route('user.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        $user->delete();
        return redirect()->route('user.index');
    }

    public function handleban(string $id, Request $request){
        $request->validate([
            "date" => "required|date"
        ]);

        $user = User::find($id);
        $user->update([
            'banned_until' => $request->date
        ]);

        return redirect()->route('user.index');
    }

    public function unban(string $id){
        $user = User::find($id);
        $user->update([
            'banned_until' => null
        ]);

        return redirect()->route('user.index');
    }

    public function bannedPage(){
        $banExpiration = User::find(request()->route('id'))->banned_until;
        if($banExpiration < now() || !$banExpiration){
            return redirect()->route('welcome');
        }
        return Inertia::render('Auth/Banned', compact('banExpiration'));
    }
}
