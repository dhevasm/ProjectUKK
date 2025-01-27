<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function product_images(){
        return $this->hasMany(ProductImages::class);
    }

    public function cart(){
        return $this->hasMany(Cart::class);
    }

    public function reviews(){
        return $this->hasMany(review::class);
    }

}
