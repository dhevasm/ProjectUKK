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
        return $this->hasOne(Payment::class);
    }

    public function cart(){
        return $this->hasOne(Cart::class);
    }

    public function delivery(){
        return $this->hasOne(Delivery::class);
    }
}
