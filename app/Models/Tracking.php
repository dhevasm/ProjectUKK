<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tracking extends Model
{
    protected $guarded = [];

    public function delivery(){
        return $this->belongsTo(Delivery::class);
    }
}
