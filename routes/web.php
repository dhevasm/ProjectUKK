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
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\FooterController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TransactionController;
use App\Models\User;

Route::get('/', [UserController::class, 'rootPage'])->name('welcome');
Route::get("/search", [ProductController::class, "search"])->name("search");
Route::post('/googleOauthHandle', [UserController::class, 'googleOauthHandle'])->name('googleOauthHandle');
Route::get('/category/{id}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/product-details/{name}', [ProductController::class, 'show'])->name('product.show.detail');
Route::get('/banned/{id}', [UserController::class, 'bannedPage'])->name('user.banned');
Route::get('/about', [FooterController::class, 'about'])->name('about');
Route::get('/feedback', [FooterController::class, 'feedback'])->name('feedback');
Route::get('/kebijakan', [FooterController::class, 'kebijakan'])->name('kebijakan');
Route::get('/help', [FooterController::class, 'help'])->name('help');
Route::post('/feedback', [FooterController::class, 'feedbackStore'])->name('feedback.store')->middleware('throttle:3,1');

Route::middleware('auth', 'verified')->group(function () {
    Route::get('/profile', [ProfileController::class, 'userProfile'])->name('user.profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/change-avatar', [ProfileController::class, 'changeAvatar'])->name('profile.change-avatar');
    Route::patch('/editAddress', [ProfileController::class, 'editAddress'])->name("profile.address");
    Route::resource('cart', CartController::class);
    Route::get('/cart-search', [CartController::class, 'search'])->name('cart.search');
    Route::post('/cart-qty/{id}', [CartController::class, 'changeQuantity'])->name("cart.qty");
    Route::post("/buy-now", [CheckoutController::class, 'buyNow'])->name('buy.now');
    Route::get("/checkout", [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post("/checkout", [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post("/create-payment", [CheckoutController::class, 'createPayment'])->name('checkout.update');
    Route::get("/payment-status/{id}", [CheckoutController::class, 'paymentStatus'])->name('payment.status');
    Route::get("/cancel-transaction/{id}", [TransactionController::class, "cancelTransaction"])->name("transaction.cancel");
    Route::get("/history", [TransactionController::class, 'userIndex'])->name('order.history');
    Route::get("/delete-history/{id}", [TransactionController::class, 'deleteHistory'])->name('delete.history');
    Route::post("/review", [ReviewController::class, 'store'])->name('review.store');
    Route::delete("/review/{id}", [ReviewController::class, 'destroy'])->name('review.destroy');
    Route::get("/confirm-delivery/{id}", [DeliveryController::class, 'confirmDelivery'])->name('delivery.confirm');
    Route::get("/sendOTP", [UserController::class, 'createOTP'])->name('sendOTP');
    Route::post("/verifyOTP", [UserController::class, 'verifyOTP'])->name('verifyOTP');
    Route::get("/phone-verify", function() {return Inertia::render('Auth/VerifyPhone');})->name('phone-verify');
    Route::post("/refund", [RefundController::class, "store"])->name('refund.store');
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
    Route::post("/updateCarouselLink", [SettingController::class, 'setCarouselLink'])->name('setCarouselLink');
    Route::delete("/deleteEvent", [SettingController::class, 'deleteEvent'])->name('deleteEvent');
    Route::delete("/deleteCarousel/{id}", [SettingController::class, 'deleteCarousel'])->name('deleteCarousel');
    Route::post("/priceSetting", [SettingController::class, 'priceSetting'])->name('priceSetting');
    Route::get("/transaction", [TransactionController::class, 'index'])->name('transaction.index');
    Route::get("/transactionStatus/{status}/{id}", [TransactionController::class, 'changeStatus'])->name('transaction.changeStatus');
    Route::get("/delivery", [DeliveryController::class, "index"])->name("delivery.index");
    Route::get("/deliveryStatus/{status}/{id}", [DeliveryController::class, 'changeStatus'])->name('delivery.changeStatus');
    Route::post("/banUser/{id}", [UserController::class, 'handleban'])->name('user.ban');
    Route::get("/unbanUser/{id}", [UserController::class, 'unban'])->name('user.unban');
    Route::get("/refund", [RefundController::class, "index"])->name('refund.index');
    Route::post("/refund/{id}", [RefundController::class, "changeStatus"])->name('refund.changeStatus');
    Route::get("/review", [ReviewController::class, "index"])->name('review.index');
});


require __DIR__.'/auth.php';
