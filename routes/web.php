<?php

use Inertia\Inertia;
use App\Models\Setting;
use App\Models\Category;
use App\Http\Middleware\CheckIsAdmin;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use PHPUnit\Framework\Attributes\Group;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;

//
Route::get('/', [UserController::class, 'rootPage'])->name('welcome');

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'userProfile'])->name('user.profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/change-avatar', [ProfileController::class, 'changeAvatar'])->name('profile.change-avatar');
    Route::patch('/editAddress', [ProfileController::class, 'editAddress'])->name("profile.address");
});

// Admin
Route::group(['middleware' => ['auth', 'verified', 'admin']], function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, "index"])->name('dashboard');
    Route::get('/admin-profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // User
    Route::resource('user', UserController::class);

    // Category
    Route::resource('category', CategoryController::class);
    Route::post('/category/{id}', [CategoryController::class, 'update'])->name('category.update');

    // Product
    Route::resource('product', ProductController::class);
    Route::delete("/deleteProductImage/{id}", [ProductController::class, 'deleteImage'])->name('deleteProductImage');
    Route::post("/product/{id}", [ProductController::class, 'update'])->name('product.update');
    Route::get("/productTrash", [ProductController::class, 'trash'])->name('product.trash');
    Route::post("/productRestore/{id}", [ProductController::class, 'restore'])->name('product.restore');
    Route::delete("/productPermanentDelete/{id}", [ProductController::class, 'permanentDelete'])->name('product.permanentDelete');

    // Web Setting
    Route::resource('setting', SettingController::class);
    Route::post("/footerSetting", [SettingController::class, 'footerSetting'])->name('footerSetting');
    Route::post("/carouselSetting", [SettingController::class, 'carouselSetting'])->name('carouselSetting');
    Route::delete("/deleteEvent", [SettingController::class, 'deleteEvent'])->name('deleteEvent');
    Route::delete("/deleteCarousel/{id}", [SettingController::class, 'deleteCarousel'])->name('deleteCarousel');
});



require __DIR__.'/auth.php';
