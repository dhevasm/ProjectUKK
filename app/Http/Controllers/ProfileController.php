<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Product;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if(isset($request->phone)){
            $request->validate([
                'phone' => "numeric|min_digits:10|max_digits:15|unique:users,phone,{$request->user()->id}",
            ]);
            $user = User::find($request->user()->id);
            $user->phone = $request->phone;
            $user->phone_verified_at = null;
            $user->save();
        }

        return Redirect::back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    // Update Profile Picture
    public function changeAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'picture' => ['required', 'image'],
        ]);

        $user = User::find($request->user()->id);

        if ($user->image && file_exists(public_path($user->image))) {
            if (is_file(public_path($user->image))) {
                unlink(public_path($user->image));
            }
        }

        $fileName = Str::uuid() . '.' . $request->file('picture')->getClientOriginalExtension();
        $filePath = 'storage/images/profiles/' . $fileName;
        $request->file('picture')->storeAs('images/profiles/', $fileName, 'public');

        $user->image = $filePath;
        $user->save();

        return Redirect::back();
    }

    // Edit Address
    public function editAddress(Request $request): RedirectResponse
    {
        $request->validate([
            'address' => ['required', 'string'],
            'coordinates' => ['required', 'string'],
        ]);

        $user = User::find($request->user()->id);
        $user->address = $request->address;
        $user->coordinates = $request->coordinates;
        $user->save();

        return Redirect::back();
    }

    public function userProfile(){
        $role = Auth::check() ? (isset(Auth::user()->roles[0]->name) ? Auth::user()->roles[0]->name : 'client') : 'guest';
        return Inertia::render('Client/Profile', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'settings' =>Setting::all(),
            'categories' =>Category::all(),
            'products' => Product::all(),
            "totalCart" => Auth::user() ? Auth::user()->carts->count() : 0,
            "role" =>  $role,
        ]);
    }
}
