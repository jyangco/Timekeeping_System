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
            } else if ($user->status != 'active') {
                return response()->json([
                    'status' => 403,
                    'message' => 'User Inactive'
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
            ->select('employees.*', 'background_images.image_path')
            ->where('employees.employee_id', '=', $user->username)
            ->leftjoin('background_images' ,'background_images.employee_id', '=', 'employees.employee_id')
            ->first();
        return response()->json([
            "id" => $profile->id,
            "employee_id" => $profile->employee_id,
            "employee_fname" => $profile->employee_fname,
            "employee_minitial" => $profile->employee_minitial,
            "employee_lname" => $profile->employee_lname,
            "employee_suffix" => $profile->employee_suffix,
            "employee_division" => $profile->employee_division,
            "employee_unit" => $profile->employee_unit,
            "schedule" => $profile->schedule,
            "background" => $profile->image_path,
            "role" => $user->role
        ]);
    }

    //UPDATE PASSWORD
    public function passwordchange(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "employee_id" => "required", 
                "old_pass" => "required|min:8",
                "new_pass" => "required|min:8",
                "confirm_pass" => "required|min:8",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                $user = DB::table('users')->select('*')->where('username', '=', $request->employee_id)->first();
                if (Hash::check($request->new_pass, $user->password)){
                    return response()->json([
                        'status' => 304,
                        "message" => "NEW PASSWORD cannot be the same as the OLD PASSWORD"
                    ]);
                } else if (Hash::check($request->old_pass, $user->password) && $request->new_pass == $request->confirm_pass) {
                    DB::table('users')
                    ->where('username',$request->employee_id)
                    ->update([
                        "password" => Hash::make($request->confirm_pass),
                    ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Password Changed!"
                    ]);
                } else if (!Hash::check($request->old_pass, $user->password)){
                    return response()->json([
                        'status' => 401,
                        "message" => "Old password incorrect!"
                    ]);
                } else {
                    return response()->json([
                        'status' => 400,
                        "message" => "Something went wrong!"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //RESET USER PASSWORD
    public function resetuserpassword(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'username' => "required"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                DB::table('users')
                    ->where('username', $request->username)
                    ->update([
                        "password" => Hash::make("password"),
                    ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success!"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }


} //END OF FILE
