import React, { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Swal from "sweetalert2"

import http from '../components/Config'
import Layout from '../components/Layout'

function NewUser() {
    const history = useNavigate()
    const [userInput, setUserInput] = useState({
        employee_id: "",
        employee_fname: "",
        employee_minitial: "",
        employee_lname: "",
        employee_suffix: "",
        employee_division: "",
        employee_unit: "",
    })

    const registernewuser = async(e) => {
        e.preventDefault()
        const data = {
            employee_id: userInput.employee_id,
            employee_fname: userInput.employee_fname,
            employee_minitial: userInput.employee_minitial,
            employee_lname: userInput.employee_lname,
            employee_suffix: userInput.employee_suffix,
            employee_division: userInput.employee_division,
            employee_unit: userInput.employee_unit,
        }
        const response = await http.post('/api/newuser', data)
        if (response.status === 200) {
            Swal.fire({
                title: response.data.message,
                text: "User registered",
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

    const handleInputChange = (e) => {
        e.persist()
        setUserInput({...userInput, [e.target.name]: e.target.value })
    }

    return (
        <Layout>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[80%] mx-auto p-5">
                <Link to={'/employees'} className="text-lg"> <i className="fas fa-arrow-alt-left"></i> </Link>
                <div className="text-4xl font-sans font-bold pb-10"> Employee Registry</div>
                <form className="text-xl" onSubmit={registernewuser}>
                    <div className="flex justify-between">
                        <div className="w-[50%]">
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_id"> Employee ID: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_id"
                                    onChange={handleInputChange}
                                    value={userInput.employee_id}
                                />
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_division"> Employee Division: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_division"
                                    onChange={handleInputChange}
                                    value={userInput.employee_division}
                                />
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_unit"> Employee Unit: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_unit"
                                    onChange={handleInputChange}
                                    value={userInput.employee_unit}
                                />
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_fname"> Employee First Name: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_fname"
                                    onChange={handleInputChange}
                                    value={userInput.employee_fname}
                                />
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_minitial"> Employee Middle Initial: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_minitial"
                                    onChange={handleInputChange}
                                    value={userInput.employee_minitial}
                                />
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_lname"> Employee Last Name: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_lname"
                                    onChange={handleInputChange}
                                    value={userInput.employee_lname}
                                />
                            </div>
                            <div className="form-group p-2 flex justify-between">
                                <label className="font-semibold p-2" htmlFor="employee_suffix"> Employee Suffix: </label>
                                <input className="border-2 border-black p-1"
                                    type="text" 
                                    name="employee_suffix"
                                    onChange={handleInputChange}
                                    value={userInput.employee_suffix}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center w-full py-10">
                        <input className="container-box w-[75%] text-3xl font-bold p-2 hover:cursor-pointer hover:shadow-2xl"
                            type='submit'
                            value={"Register"}
                        />
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default NewUser