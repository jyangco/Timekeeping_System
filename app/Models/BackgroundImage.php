<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackgroundImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'image_id';
    
    protected $fillable = [
        'employee_id',
        'image_path',
    ];
}
