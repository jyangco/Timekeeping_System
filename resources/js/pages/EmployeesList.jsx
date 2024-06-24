import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import http from '../components/Config'
import Layout from '../components/Layout'

function EmployeesList(){
    const [ emps, setEmps ] = useState([])
    const [ nameInput, setNameInput ] = useState("")
    const [ searchResult, setSearchResults ] = useState([])

    const fetchEmployeeDetails = async() => {
        try {
            http.get('/api/getallemployees').then(response => {
                setEmps(response.data)
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchEmployeeDetails()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        setTimeout(() => {
            setSearchResults(
                emps.filter(
                    emp => emp.employee_fname.toLowerCase().includes(nameInput.toLowerCase()) ||
                    emp.employee_lname.toLowerCase().includes(nameInput.toLowerCase()) ||
                    emp.employee_fname.toLowerCase() + " " + emp.employee_lname.toLowerCase() == nameInput.toLowerCase() ||
                    emp.employee_lname.toLowerCase() + " " + emp.employee_fname.toLowerCase() == nameInput.toLowerCase()
                )
            )
        }, 5)
    } 

    const handleClear = (e) => {
        e.preventDefault()
        setSearchResults(emps)
        setNameInput("")
    } 

    var view = ""
        if (searchResult == "" && nameInput.length == 0) {
            view = (
                <tbody>
                    {emps.map((value, ndx) => 
                        <tr key={ndx}>
                            <td className="border-2 border-black p-1 text-xl"> {value.employee_fname} {value.employee_minitial}. {value.employee_lname} </td>
                            <td className="border-2 border-black p-1 text-xl"> {value.employee_division} </td>
                            <td className="border-2 border-black p-1 text-xl"> {value.employee_unit} </td>
                            <td className="border-2 border-black p-1 text-xl text-center"> {value.schedule} </td>
                        </tr>
                    )}
                </tbody>
            )
        } else if (nameInput.length != 0 && searchResult == "") {
            view = (
                <tbody>
                    <tr className='hover:cursor-pointer'>
                        <td className="border-2 border-black text-center p-5 text-4xl" colSpan={6}> NO MATCH FOUND </td>
                    </tr>
                </tbody>
            )
        } else {
            view = (
                <tbody>
                    {searchResult.map((value,ndx) => 
                        <tr key={ndx}>
                            <td className="border-2 border-black p-1 text-xl"> {value.employee_fname} {value.employee_minitial}. {value.employee_lname} </td>
                            <td className="border-2 border-black p-1 text-xl"> {value.employee_division} </td>
                            <td className="border-2 border-black p-1 text-xl"> {value.employee_unit} </td>
                            <td className="border-2 border-black p-1 text-xl text-center"> {value.schedule} </td>
                        </tr>
                    )}
                </tbody>
            )
        }

    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[90%] mx-auto p-5">
                <div className="flex justify-between font-sans font-bold pb-10">
                    <div className="text-4xl"> Employee List </div>
                    <div className="text-2xl">
                        <div className="flex p-2 w-[100%]">
                            <button className='rounded-l-lg bg-slate-500 text-white text-lg px-2' onClick={handleClear}>
                                <i className="far fa-sync"></i>
                            </button>
                            <input
                                className='border-2 w-[90%] border-black px-1 text-lg'
                                type="text"
                                placeholder='Search ... '
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value.toLowerCase()) }
                            />
                            <button className='rounded-r-lg bg-slate-500 text-white text-lg px-2' onClick={handleSearch}>
                                <i className="far fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <Link to={'/employees/new'} className="bg-slate-500 p-2 text-xl text-white">
                        <i className="fas fa-plus"></i>
                    </Link>
                </div>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="border-2 border-black p-3 text-2xl w-[25%]"> Name </th>
                            <th className="border-2 border-black p-3 text-2xl w-[25%]"> Divison </th>
                            <th className="border-2 border-black p-3 text-2xl w-[25%]"> Unit </th>
                            <th className="border-2 border-black p-3 text-2xl w-[25%]"> Schedule </th>
                        </tr>
                    </thead>
                    {view}
                </table>
            </div>
        </Layout>
    )
}

export default EmployeesList