<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('employees')->insert([
            [
                'employee_id' => 185,
                'employee_fname' => 'Jason',
                'employee_minitial' => 'S',
                'employee_lname' => 'Yangco',
                'employee_suffix' => '',
                'employee_division' => 'Finance and Administrative Division',
                'employee_unit' => 'Human Resource Management Unit',
                'schedule' => 'Monday',
            ],
            [
                'employee_id' => 225,
                'employee_fname' => 'Madelyn',
                'employee_minitial' => 'P',
                'employee_lname' => 'Recio',
                'employee_suffix' => '',
                'employee_division' => 'Office of the Director',
                'employee_unit' => 'Planning Unit',
                'schedule' => 'Monday',
            ]
        ]);
    }
}
