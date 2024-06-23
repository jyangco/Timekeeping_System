<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Userlog extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'morning_timein',
        'morning_timeout',
        'afternoon_timein',
        'afternoon_timeout',
        'attachment',
        'employee_id'
    ];
}
