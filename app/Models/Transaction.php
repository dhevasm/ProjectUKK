<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function payment(){
        return $this->belongsTo(Payment::class);
    }

    public function cart(){
        return $this->belongsTo(Cart::class);
    }

    public function delivery(){
        return $this->belongsTo(Delivery::class);
    }

    public function data_undangan(){
        return $this->belongsTo(DataUndangan::class);
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
