import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import Layout from '../components/Layout'
import http from "../components/Config"
import Loader from '../components/Loader'

function EmployeeProfile(){
    const location = useLocation()
    const history = useNavigate()
    const [ empProfile, setEmpProfile ] = useState("")
    const [ loading, setLoading ] = useState(true)

    const divisions = [
        'Office of the Director',
        'Science Education and Innovations Division',
        'Finance and Administrative Division',
        'Science and Technology Scholarship Division',
        'Science and Technology Manpower Education Research and Promotions Division'
    ]

    const units = [
        [
            'Office of the Deputy Director (ODD)',
            'Planning Unit'
        ], 
        [
            'Training Unit',
            'Program Development Unit',
            'Innovations Unit'
        ],
        [
            'Budget Unit',
            'Collection and Disbursement Unit',
            'Human Resource Management Unit',
            'Records Unit',
            'General Services Unit',
            'Interim Procurement Unit',
            'Building Maintenance Section'
        ],
        [
            'Scholarship Administrations and Monitoring Unit',
            'Scholarship Technical Support and Service Unit'
        ],
        [
            'Promotions Unit',
            'Research Unit',
            'Management Information System Unit'
        ]
    ]

    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
    ]

    useEffect(() => {
        const location_id = location.state.id
        const data = {
            id: location_id
        }
        const fetchEmployeeProfile = async() => {
            try {
                const response = await http.post('/api/getemployeeprofile', data)
                setEmpProfile(response.data.user)
            } catch (error) {
                console.error(error)
            }
        }
        fetchEmployeeProfile()
        setTimeout(() => {
            setLoading(false)
        }, 2500)
    },[])

    const handleInputChange = (e) => {
        e.persist()
        setEmpProfile({...empProfile, [e.target.name]: e.target.value })
    }

    const updateemployeeprofile = async(e) => {
        e.preventDefault()
        const data = {
            id: empProfile.id,
            employee_id: empProfile.employee_id,
            employee_fname: empProfile.employee_fname,
            employee_minitial: empProfile.employee_minitial,
            employee_lname: empProfile.employee_lname,
            employee_suffix: empProfile.employee_suffix,
            employee_division: empProfile.employee_division,
            employee_unit: empProfile.employee_unit,
            schedule: empProfile.schedule,
            role: empProfile.role,
            status: empProfile.status,
        }
        const response = await http.post('/api/editemployeeprofile', data)
        if (response.status === 200) {
            Swal.fire({
                title: response.data.message,
                text: "User updated",
                icon: "success"
            })
            history('/employees')
        } else if (response.status === 400) {
            Swal.fire({
                title: "Validation error",
                text: "Make sure to fill everything",
                icon: "warning"
            })
        } else {
            Swal.fire({
                title: response.data.error, 
                text: response.data.message, 
                icon: "warning"
            })
        }
    }

    if (loading) {
        return(
            <Layout>
                <Loader/>
            </Layout>
        )
    }

    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[80%] mx-auto p-5">
                <Link to={'/employees'} className="text-lg"> <i className="fas fa-arrow-alt-left"></i> </Link>
                <div className="text-4xl font-sans font-bold pb-10"> Employee Profile</div>
                <form className="text-xl" onSubmit={updateemployeeprofile}>
                    <div className="flex justify-between">
                        <div className="form-group p-2">
                            <label className="font-semibold p-2" htmlFor="status"> Account status: </label>
                            <label className="p-2">
                                <input className="border-2 border-black p-1"
                                    type="radio" 
                                    name="status"
                                    checked={ empProfile.status === 'active'}
                                    value={'active'}
                                    onChange={handleInputChange}
                                />
                                Active
                            </label>
                            <label className="p-2">
                                <input className="border-2 border-black p-1"
                                    type="radio" 
                                    name="status"
                                    checked={ empProfile.status === 'inactive'}
                                    value={'inactive'}
                                    onChange={handleInputChange}
                                />
                                Inactive
                            </label>
                        </div>
                        <Link to={`/employees/${empProfile.id}/logs`} state={{ employee_id: `${empProfile.employee_id}` }} className="text-lg p-3"> <i className="fas fa-arrow-alt-right"></i> </Link>
                    </div>
                    <div className="flex justify-between">
                        <div className="w-[50%]">
                            <div className="flex">
                                <div className="form-group p-2 flex justify-between w-[50%]">
                                    <label className="font-semibold p-2" htmlFor="employee_id"> ID: </label>
                                    <input className="border-2 border-black p-1"
                                        type="text" 
                                        name="employee_id"
                                        onChange={handleInputChange}
                                        value={empProfile.employee_id}
                                    />
                                </div>
                                <div className="form-group p-2 flex justify-between w-[50%]">
                                    <label className="font-semibold p-2" htmlFor="role"> Role: </label>
                                    <select className="custom-select border-2 border-black p-1 w-full"
                                        name="role"
                                        value={empProfile.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value={""} className="text-center"> -- SELECT ONE -- </option>
                                        <option value={"admin"} className="text-center"> Admin </option>
                                        <option value={"user"} className="text-center"> User </option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group p-2 flex flex-wrap">
                                <label className="font-semibold p-2" htmlFor="employee_division"> Division: </label>
                                <select className="custom-select border-2 border-black p-1 w-full"
                                    name="employee_division"
                                    value={empProfile.employee_division}
                                    onChange={handleInputChange}
                                >
                                    <option value={""} className="text-center"> -- SELECT ONE -- </option>
                                    {divisions.map((val,ndx) => 
                                        <option key={ndx} value={val}> {val} </option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group p-2 flex flex-wrap">
                                <label className="font-semibold p-2" htmlFor="employee_unit"> Unit: </label>
                                <select className="custom-select border-2 border-black p-1 w-full"
                                    name="employee_unit"
                                    onChange={handleInputChange}
                                    value={empProfile.employee_unit}
                                    // disabled={ empProfile.employee_division.length == 0 ? true : false }
                                >
                                    <option className="text-center"> -- SELECT ONE -- </option>
                                    {
                                    empProfile.employee_division == 'Office of the Director' ? 
                                        units[0].map((val,ndx) => 
                                            <option key={ndx} value={val}> {val} </option>
                                        ) : 
                                    empProfile.employee_division == 'Science Education and Innovations Division' ? 
                                        units[1].map((val,ndx) => 
                                            <option key={ndx} value={val}> {val} </option>
                                        ) :
                                    empProfile.employee_division == 'Finance and Administrative Division' ? 
                                        units[2].map((val,ndx) => 
                                            <option key={ndx} value={val}> {val} </option>
                                        ) :
                                    empProfile.employee_division == 'Science and Technology Scholarship Division' ? 
                                        units[3].map((val,ndx) => 
                                            <option key={ndx} value={val}> {val} </option>
                                        ) :
                                    empProfile.employee_division == 'Science and Technology Manpower Education Research and Promotions Division' ? 
                                        units[4].map((val,ndx) => 
                                            <option key={ndx} value={val}> {val} </option>
                                        ) : ""
                                    }  
                                </select>
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2 w-[25%]" htmlFor="employee_fname"> First Name: </label>
                                <input className="border-2 border-black p-1 w-[75%]"
                                    type="text" 
                                    name="employee_fname"
                                    onChange={handleInputChange}
                                    value={empProfile.employee_fname}
                                />
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2 w-[25%]" htmlFor="employee_lname"> Last Name: </label>
                                <input className="border-2 border-black p-1 w-[75%]"
                                    type="text" 
                                    name="employee_lname"
                                    onChange={handleInputChange}
                                    value={empProfile.employee_lname}
                                />
                            </div>
                            <div className="flex">
                                <div className="form-group p-2 flex justify-between w-[50%]">
                                    <label className="font-semibold p-2" htmlFor="employee_minitial"> M.I: </label>
                                    <input className="border-2 border-black p-1"
                                        type="text" 
                                        name="employee_minitial"
                                        onChange={handleInputChange}
                                        value={empProfile.employee_minitial}
                                    />
                                </div>
                                <div className="form-group p-2 flex justify-between w-[50%]">
                                    <label className="font-semibold p-2" htmlFor="employee_suffix">  Suffix: </label>
                                    <input className="border-2 border-black p-1"
                                        type="text" 
                                        name="employee_suffix"
                                        onChange={handleInputChange}
                                        value={empProfile.employee_suffix}
                                    />
                                </div>
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2 w-[25%]" htmlFor="schedule"> WFH Schedule: </label>
                                <select className="custom-select border-2 border-black p-1 w-[75%]"
                                    name="schedule"
                                    onChange={handleInputChange}
                                    value={empProfile.schedule}
                                >
                                    <option value={""} className="text-center"> -- SELECT ONE -- </option>
                                    {days.map((val,ndx) => 
                                        <option key={ndx} value={val}> {val} </option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center w-full py-10">
                        <input className="container-box w-[75%] text-3xl font-bold p-2 hover:cursor-pointer hover:shadow-2xl"
                            type='submit'
                            value={"Update"}
                        />
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default EmployeeProfile