<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Models\User;
use App\Models\Employee;
use App\Models\Userlog;
use App\Models\BackgroundImage;

class EmployeesController extends Controller
{
    //GET ALL EMPLOYEES
    public function getallemployees(){
        $employees = DB::table('employees')
            ->orderBy('employee_lname')
            ->get();
        return $employees;
    }


    //REGISTER NEW EMPLOYEE AND MAKE AN ACCOUNT
    public function newuser(Request $request){
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required',
            'employee_fname' => 'required',
            'employee_minitial' => 'required',
            'employee_lname' => 'required',
            'employee_suffix',
            'employee_division' => 'required',
            'employee_unit' => 'required',
            'schedule' => 'required',
            'role' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ],400);
        }
        DB::beginTransaction();
        try {
            if ($request->employee_suffix == "") {
                $employee = Employee::create([
                    'employee_id' => $request->employee_id,
                    'employee_fname' => $request->employee_fname,
                    'employee_minitial' => $request->employee_minitial,
                    'employee_lname' => $request->employee_lname,
                    'employee_suffix' => "",
                    'employee_division' => $request->employee_division,
                    'employee_unit' => $request->employee_unit,
                    'schedule' => $request->schedule
                ]);
            } else {
                $employee = Employee::create([
                    'employee_id' => $request->employee_id,
                    'employee_fname' => $request->employee_fname,
                    'employee_minitial' => $request->employee_minitial,
                    'employee_lname' => $request->employee_lname,
                    'employee_suffix' => $request->employee_suffix,
                    'employee_division' => $request->employee_division,
                    'employee_unit' => $request->employee_unit,
                    'schedule' => $request->schedule
                ]);
            }
            $user = User::create([
                'username' => $employee->employee_id,
                'password' => Hash::make('password'),
                'role' => $request->role,
                'status' => 'active',
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Success',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    //GET EMPLOYEE DETAILS
    public function getemployeeprofile(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ],400);
        }
        DB::beginTransaction();
        try {
            $user = Employee::select('employees.*', 'users.username', 'users.status', 'users.role')
                ->where("employees.id", "=", $request->id)
                ->join("users", "users.username", "=", "employees.employee_id")
                ->first();
            DB::commit();
            return response()->json([
                'message' => 'Success',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    //EDIT EMPLOYEE DETAILS
    public function editemployeedetails(Request $request) {
        $validator = Validator::make($request->all(), [
            'id',
            'employee_id',
            'employee_fname',
            'employee_minitial',
            'employee_lname',
            'employee_suffix',
            'employee_division',
            'employee_unit',
            'schedule',
            'role',
            'status',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ],400);
        }
        DB::beginTransaction();
        try {
            if ($request->employee_suffix == "") {
                $emp = DB::table('employees')
                ->where("employees.id", "=", $request->id)
                ->update([
                    'employee_id' => $request->employee_id,
                    'employee_fname' => $request->employee_fname,
                    'employee_minitial' => $request->employee_minitial,
                    'employee_lname' => $request->employee_lname,
                    'employee_suffix' => "",
                    'employee_division' => $request->employee_division,
                    'employee_unit' => $request->employee_unit,
                    'schedule' => $request->schedule
                ]);
            } else {
                $emp = DB::table('employees')
                ->where("employees.id", "=", $request->id)
                ->update([
                    'employee_id' => $request->employee_id,
                    'employee_fname' => $request->employee_fname,
                    'employee_minitial' => $request->employee_minitial,
                    'employee_lname' => $request->employee_lname,
                    'employee_suffix' => $request->employee_suffix,
                    'employee_division' => $request->employee_division,
                    'employee_unit' => $request->employee_unit,
                    'schedule' => $request->schedule
                ]);
            }
            $user = DB::table('users')
                ->where('username', '=', $request->employee_id)
                ->update([
                    'username' => $request->employee_id,
                    'role' => $request->role,
                    'status' => $request->status,
                ]);
            DB::commit();
            return response()->json([
                'message' => 'Success',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    //GET SPECIFIC USER LOGS
    public function getemployeelogs(Request $request) {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ],400);
        }
        DB::beginTransaction();
        try {
            $logs = array();
            $user = Employee::select('employees.*')->where("employees.employee_id", "=", $request->employee_id)->first();
            $userlogs = Userlog::select('*')->get();
            foreach ($userlogs as $value) {
                if ($value->employee_id == $user->employee_id) {
                    array_push($logs, $value);
                }
            }
            DB::commit();
            return response()->json([
                'message' => 'Success',
                'user' => $user,
                'logs' => $logs
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    //UPLOAD USER BACKGROUND
    public function uploadbackground(Request $request) {
        $validator = Validator::make($request->all(), [
            'employee_id'  => 'required',
            'image_path' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        DB::beginTransaction();
        try {
            if ($request->hasFile('image_path')) {
                $file = $request->file('image_path');
                $filename = $file->getClientOriginalName();
                $path = ("backgroundimages");
                $file_name = $path."/".$filename;
                $file->move($path, $filename);
            }
            $bg_image = BackgroundImage::create([
                'employee_id' => $request->employee_id,
                'image_path' => $file_name,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Success', 
                'userlog' => $bg_image
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    //DELETING BACKGROUND IMAGE FROM DATABASE
    public function removebackground(Request $request){
        $validator = Validator::make($request->all(), [
            'employee_id'  => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        DB::beginTransaction();
        try {
            DB::table('background_images')
                ->where('employee_id', '=', $request->employee_id)
                ->delete();
            DB::commit();
            return response()->json([
                'message' => 'Background image removed', 
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

}// END OF FILE
