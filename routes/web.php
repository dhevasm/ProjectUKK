<?php

use Inertia\Inertia;
use App\Models\Setting;
use App\Models\Category;
use App\Http\Middleware\CheckIsAdmin;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use PHPUnit\Framework\Attributes\Group;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;

Route::get('/', [UserController::class, 'rootPage'])->name('welcome');
Route::get("/search", [ProductController::class, "search"])->name("search");
Route::post('/googleOauthHandle', [UserController::class, 'googleOauthHandle'])->name('googleOauthHandle');
Route::get('/category/{id}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/product-details/{id}', [ProductController::class, 'show'])->name('product.show.detail');
Route::get('/banned/{id}', [UserController::class, 'bannedPage'])->name('user.banned');

Route::middleware('auth', 'verified')->group(function () {
    Route::get('/profile', [ProfileController::class, 'userProfile'])->name('user.profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/change-avatar', [ProfileController::class, 'changeAvatar'])->name('profile.change-avatar');
    Route::patch('/editAddress', [ProfileController::class, 'editAddress'])->name("profile.address");
    Route::resource('cart', CartController::class);
    Route::get('/cart-search', [CartController::class, 'search'])->name('cart.search');
    Route::post('/cart-qty/{id}', [CartController::class, 'changeQuantity'])->name("cart.qty");

    Route::get("/sendOTP", [UserController::class, 'createOTP'])->name('sendOTP');
    Route::post("/verifyOTP", [UserController::class, 'verifyOTP'])->name('verifyOTP');
    Route::get("/phone-verify", function() {return Inertia::render('Auth/VerifyPhone');})->name('phone-verify');
});

Route::group(['middleware' => ['auth', 'admin']], function () {
    Route::resource('category', CategoryController::class);
    Route::resource('product', ProductController::class);
    Route::post("user/{id}", [UserController::class, 'update'])->name('user.update');
    Route::get('/dashboard', [DashboardController::class, "index"])->name('dashboard');
    Route::get('/admin-profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::resource('user', UserController::class);
    Route::post('/category/{id}', [CategoryController::class, '
    update'])->name('category.update');
    Route::delete("/deleteProductImage/{id}", [ProductController::class, 'deleteImage'])->name('deleteProductImage');
    Route::post("/product/{id}", [ProductController::class, 'update'])->name('product.update');
    Route::get("/productTrash", [ProductController::class, 'trash'])->name('product.trash');
    Route::post("/productRestore/{id}", [ProductController::class, 'restore'])->name('product.restore');
    Route::delete("/productPermanentDelete/{id}", [ProductController::class, 'permanentDelete'])->name('product.permanentDelete');
    Route::resource('setting', SettingController::class);
    Route::post("/footerSetting", [SettingController::class, 'footerSetting'])->name('footerSetting');
    Route::post("/carouselSetting", [SettingController::class, 'carouselSetting'])->name('carouselSetting');
    Route::delete("/deleteEvent", [SettingController::class, 'deleteEvent'])->name('deleteEvent');
    Route::delete("/deleteCarousel/{id}", [SettingController::class, 'deleteCarousel'])->name('deleteCarousel');

    Route::post("/banUser/{id}", [UserController::class, 'handleban'])->name('user.ban');
    Route::get("/unbanUser/{id}", [UserController::class, 'unban'])->name('user.unban');
});



require __DIR__.'/auth.php';
