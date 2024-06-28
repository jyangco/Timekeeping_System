import React, { useEffect, useState, useRef } from "react"
import { Link } from 'react-router-dom'
import ReactToPrint from 'react-to-print'

import http from '../components/Config'
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import Modal from '../components/Modal'

function EmployeesList(){
    const [ emps, setEmps ] = useState([])
    const [ nameInput, setNameInput ] = useState("")
    const [ searchResult, setSearchResults ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ show, setShow ] = useState(false)
    const [ filters, setFilter ] = useState({
        divFilter : "Any",
        unitFilter : "Any",
        schedFilter : "Any",
    })

    const componentRef = useRef()

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

    const fetchEmployeeDetails = async() => {
        try {
            http.get('/api/getallemployees').then(response => {
                setEmps(response.data)
                if (filters.divFilter == "Any" && filters.unitFilter == "Any" && filters.schedFilter == "Any") {
                    setSearchResults(response.data)
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchEmployeeDetails()
        setTimeout(() => {
            setLoading(false)
        }, 2500)
        if (filters.divFilter == "Any" && filters.unitFilter == "Any" && filters.schedFilter == "Any") {
            setSearchResults(emps)
        } else {
            setSearchResults(
                emps.filter(emp => {
                    const matchesDivision = filters.divFilter == "Any" || emp.employee_division == filters.divFilter
                    const matchesUnit = filters.unitFilter == "Any" || emp.employee_unit == filters.unitFilter
                    const matchesSchedule = filters.schedFilter == "Any" || emp.schedule == filters.schedFilter
                    return matchesDivision && matchesUnit && matchesSchedule
                })
            )
        }
    }, [filters])

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

    if (loading) {
        return(
            <Layout>
                <Loader/>
            </Layout>
        )
    }

    const handleFilter = (e) => {
        setFilter({...filters, [e.target.name]: e.target.value })
    }

    const openModal = (e) => {
        e.preventDefault()
        setShow(true)
    }

    const closeModal = (e) => {
        e.preventDefault()
        setShow(false)
    }

    return(
        <Layout>
            <Modal show={show} handleClose={closeModal}>
                <div className="flex justify-start">
                    <ReactToPrint
                        trigger={ () => {
                            return (
                                <div className="flex justify-center">
                                    <button className="text-xl bg-blue-500 text-white px-5 py-2"> 
                                        Download/Print! 
                                    </button>
                                </div>
                            )}}
                        content={() => componentRef.current}
                        pageStyle='@page {
                            margin: 8mm;
                            size: landscape;
                        }'
                    />
                </div>
                <div className="ComponentToPrint" ref={componentRef}>
                    <div className="text-center text-3xl font-sans font-bold py-10"> List of WFH Employees </div>
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th className="outline outline-1 border-2 border-black p-2 text-xl w-[5%]"> Name </th>
                                <th className="outline outline-1 border-2 border-black p-2 text-xl w-[25%]"> Name </th>
                                <th className="outline outline-1 border-2 border-black p-2 text-xl w-[25%]"> Divison </th>
                                <th className="outline outline-1 border-2 border-black p-2 text-xl w-[25%]"> Unit </th>
                                <th className="outline outline-1 border-2 border-black p-2 text-xl w-[10%]"> Schedule </th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResult.map((value,ndx) => 
                                <tr className="hover:cursor-pointer hover:bg-slate-400 hover:text-white" key={ndx}>
                                    <td className="border-2 border-black p-2 text-xl text-center"> {ndx + 1} </td>
                                    <td className="border-2 border-black p-2 text-xl"> {value.employee_lname}, {value.employee_fname} {value.employee_minitial} {value.employee_suffix} </td>
                                    <td className="border-2 border-black p-2 text-xl"> {value.employee_division} </td>
                                    <td className="border-2 border-black p-2 text-xl"> {value.employee_unit} </td>
                                    <td className="border-2 border-black p-2 text-xl text-center"> {value.schedule} </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[90%] mx-auto p-5">
                <div className="flex justify-between font-sans font-bold pb-10">
                    <div className="text-4xl"> Employee List </div>
                    <Link to={'/employees/new'} className="bg-slate-500 p-2 text-xl text-white">
                        <i className="fas fa-plus"></i>
                    </Link>
                </div>
                <button onClick={openModal} className="mb-3 p-2 border-2 bg-black text-white font-bold border-black rounded-xl shadow-md hover:!bg-slate-300 hover:!text-black">
                    Print Table
                </button>
                <div className="flex text-2xl">
                    <div className="w-[25%] flex flex-wrap p-2">
                        Name <i className="far fa-filter p-1"></i>
                        <div className="flex w-[100%]">
                            <button className='rounded-l-lg bg-slate-500 text-white text-lg px-2' onClick={handleClear}>
                                <i className="far fa-sync"></i>
                            </button>
                            <input
                                className='border-2 w-[90%] border-black text-lg p-1'
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
                    <div className="w-[25%] p-2 flex flex-wrap"> 
                        Division <i className="far fa-filter p-1"></i>
                        <select 
                            name="divFilter"
                            value={filters.divFilter}
                            onChange={handleFilter}
                            className='custom-select w-full border-2 border-black border rounded text-xl p-1 outline-none'
                        >
                            <option value="Any"> Any </option>
                            {divisions.map((val,ndx) => 
                                <option key={ndx} value={val}> {val} </option>
                            )}
                        </select>
                    </div>
                    <div className="w-[25%] p-2 flex flex-wrap"> 
                        Unit <i className="far fa-filter p-1"></i>
                        <select 
                            name="unitFilter"
                            value={filters.unitFilter}
                            onChange={handleFilter}
                            className='custom-select w-full border-2 border-black border rounded text-xl p-1 outline-none'
                        >
                            <option value="Any"> Any </option>
                            {filters.divFilter == 'Office of the Director' ? 
                                units[0].map((val,ndx) => 
                                    <option key={ndx} value={val}> {val} </option>
                                ) : 
                            filters.divFilter == 'Science Education and Innovations Division' ? 
                                units[1].map((val,ndx) => 
                                    <option key={ndx} value={val}> {val} </option>
                                ) :
                            filters.divFilter == 'Finance and Administrative Division' ? 
                                units[2].map((val,ndx) => 
                                    <option key={ndx} value={val}> {val} </option>
                                ) :
                            filters.divFilter == 'Science and Technology Scholarship Division' ? 
                                units[3].map((val,ndx) => 
                                    <option key={ndx} value={val}> {val} </option>
                                ) :
                            filters.divFilter == 'Science and Technology Manpower Education Research and Promotions Division' ? 
                                units[4].map((val,ndx) => 
                                    <option key={ndx} value={val}> {val} </option>
                                ) : ""
                            }  
                        </select>
                    </div>
                    <div className="w-[25%] p-2 flex flex-wrap"> 
                        Schedule <i className="far fa-filter p-1"></i>
                        <select 
                            name="schedFilter"
                            value={filters.schedFilter}
                            onChange={handleFilter}
                            className='custom-select w-full border-2 border-black border rounded text-xl p-1 outline-none'
                        >
                            <option value="Any"> Any </option>
                            {days.map((val,ndx) => 
                                <option key={ndx} value={val}> {val} </option>
                            )}
                        </select>
                    </div>
                </div>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="outline outline-1 border-2 border-black p-3 text-2xl w-[25%]"> Name </th>
                            <th className="outline outline-1 border-2 border-black p-3 text-2xl w-[25%]"> Divison </th>
                            <th className="outline outline-1 border-2 border-black p-3 text-2xl w-[25%]"> Unit </th>
                            <th className="outline outline-1 border-2 border-black p-3 text-2xl w-[15%]"> Schedule </th>
                            <th className="outline outline-1 border-2 border-black p-3 text-2xl w-[10%]"> Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResult.map((value,ndx) => 
                            <tr className="hover:cursor-pointer hover:bg-slate-400 hover:text-white" key={ndx}>
                                <td className="border-2 border-black p-3 text-2xl"> {value.employee_lname}, {value.employee_fname} {value.employee_minitial} {value.employee_suffix} </td>
                                <td className="border-2 border-black p-3 text-2xl"> {value.employee_division} </td>
                                <td className="border-2 border-black p-3 text-2xl"> {value.employee_unit} </td>
                                <td className="border-2 border-black p-3 text-2xl text-center"> {value.schedule} </td>
                                <td className="border-2 border-black p-3 text-2xl text-center">
                                    <Link to={`/employees/${value.id}`} state={{ id: value.id}} className="p-1 bg-green-500 border"> 
                                        <i className="far fa-user-edit"></i>
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default EmployeesList