<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Employee;

class AuthController extends Controller
{
    //LOGIN FUNCTION
    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else if ($user = User::where('username', $request->username)->first()) {
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid Credentials'
                ]);
            } else {
                $role = User::select('users.*')->where('id', $user->id)->first();
                if ($role->role == 'admin') {
                    $token = $user->createToken($user->username,['server:admin'])->plainTextToken;
                    return response()->json([
                        'status' => 200,
                        'token' => $token,
                        'id_number' => $user->username,
                        'role' => $role->role
                    ]);
                } else {
                    $token = $user->createToken($user->username,['server:user'])->plainTextToken;
                    return response()->json([
                        'status' => 200,
                        'token' => $token,
                        'id_number' => $user->username,
                        'role' => $role->role
                    ]);
                }
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid Credentials'
            ]);
        }
    }

    //LOGOUT FUNCTION
    public function logout(){
        $user = Auth::user();
        DB::table('personal_access_tokens')
        ->where('tokenable_id', $user->id)
        ->update(['revoked' => true]);
        return response()->json([
            'status' => 200,
            'message' => 'Bye Bye ...'
        ]);
    }

    //GET USERDETAILS
    public function getuserdetails(){
        $user = Auth::user();
        $profile = DB::table('employees')
            ->select('*')
            ->where('employee_id', '=', $user->username)
            ->first();
        return response()->json([
            "id" => $profile->id,
            "employee_id" => $profile->employee_id,
            "employee_fname" => $profile->employee_fname,
            "employee_minitial" => $profile->employee_minitial,
            "employee_lname" => $profile->employee_lname,
            "employee_division" => $profile->employee_division,
            "employee_unit" => $profile->employee_unit,
            "schedule" => $profile->schedule,
            "role" => $user->role
        ]);
    }

} //END OF FILE
