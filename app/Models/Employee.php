<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'employee_fname',
        'employee_minitial',
        'employee_lname',
        'employee_division',
        'employee_unit'
    ];
}
