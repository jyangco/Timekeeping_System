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

class UserLogsController extends Controller
{

    //GET USER LOG TODAY
    public function getuserlogtoday() {
        $date_today = Carbon::now()->format('F d, Y');
        $user = Auth::user();
        $user_log = DB::table('userlogs')
            ->select('*')
            ->where('employee_id', '=', $user->username)
            ->where('date', '=', $date_today)
            ->first();
        return $user_log;
    }

    //SET USER TIMEIN
    public function setmorningtimein(Request $request) {
        $validator = Validator::make($request->all(), [
            'date' => 'required',
            'morning_timein' => 'required',
            'morning_timeout',
            'afternoon_timein',
            'afternoon_timeout',
            'attachment',
            'employee_id' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        DB::beginTransaction();
        try {
            $userlog = Userlog::create([
                'date' => $request->date,
                'morning_timein' => $request->morning_timein,
                'employee_id' => $request->employee_id,
                'morning_timeout' => "",
                'afternoon_timein' => "",
                'afternoon_timeout' => "",
                'attachment' => "",
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Success', 
                'userlog' => $userlog
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Server Error', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

}//END OF FILE
