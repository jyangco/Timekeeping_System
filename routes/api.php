<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', 'App\Http\Controllers\api\AuthController@login');



Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/getuserdetails', 'App\Http\Controllers\api\AuthController@getuserdetails');
    Route::post('/logout', 'App\Http\Controllers\api\AuthController@logout');
    Route::post('/passwordchange', 'App\Http\Controllers\api\AuthController@passwordchange');

    Route::get('/getuserlogtoday', 'App\Http\Controllers\api\UserLogsController@getuserlogtoday');
    Route::get('/getuserlog', 'App\Http\Controllers\api\UserLogsController@getuserlog');
    Route::post('/setmorningtimein', 'App\Http\Controllers\api\UserLogsController@setmorningtimein');
    Route::post('/setmorningtimeout', 'App\Http\Controllers\api\UserLogsController@setmorningtimeout');
    Route::post('/setafternoontimein', 'App\Http\Controllers\api\UserLogsController@setafternoontimein');
    Route::post('/setafternoontimeout', 'App\Http\Controllers\api\UserLogsController@setafternoontimeout');
    Route::post('/getuserlogfortheday', 'App\Http\Controllers\api\UserLogsController@getuserlogfortheday');

    Route::get('/getallemployees', 'App\Http\Controllers\api\EmployeesController@getallemployees');
    Route::post('/newuser', 'App\Http\Controllers\api\EmployeesController@newuser');
    Route::post('/getemployeeprofile', 'App\Http\Controllers\api\EmployeesController@getemployeeprofile');
    Route::post('/editemployeeprofile', 'App\Http\Controllers\api\EmployeesController@editemployeedetails');
    Route::post('/getemployeelogs', 'App\Http\Controllers\api\EmployeesController@getemployeelogs');
});

