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

class EmployeesController extends Controller
{
    //GET ALL EMPLOYEES
    public function getallemployees(){
        $employees = DB::table('employees')
            ->select('*')
            ->get();
        return $employees;
    }

    public function newuser(Request $request){
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required',
            'employee_fname' => 'required',
            'employee_minitial' => 'required',
            'employee_lname' => 'required',
            'employee_suffix' => 'required',
            'employee_division' => 'required',
            'employee_unit' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ],400);
        }
        DB::beginTransaction();
        try {
            $employee = Employee::create([
                'employee_id' => $request->employee_id,
                'employee_fname' => $request->employee_fname,
                'employee_minitial' => $request->employee_minitial,
                'employee_lname' => $request->employee_lname,
                'employee_suffix' => $request->employee_suffix,
                'employee_division' => $request->employee_division,
                'employee_unit' => $request->employee_unit,
            ]);
            $user = User::create([
                'username' => $employee->employee_id,
                'password' => Hask::make('password')
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
}
