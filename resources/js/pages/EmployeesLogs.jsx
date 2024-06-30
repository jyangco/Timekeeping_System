import React, { useEffect, useState, useRef } from "react"
import moment from "moment"
import ReactToPrint from 'react-to-print'

import http from '../components/Config'
import Layout from '../components/Layout'
import Modal from "../components/Modal"
import Loader from '../components/Loader'
import ExportToCSV from "./ExportToCSV"

const FileViewer = ({ filePath }) => {
    const renderFileViewer = (path) => {
    const fileExtension = path.split('.').pop().toLowerCase()
    const displayableFileTypes = ['pdf']
        if (displayableFileTypes.includes(fileExtension)) {
            return (
                <iframe 
                    className='h-[85vh] w-full border-4 border-purplehaze' 
                    src={path}
                />
            )
        } else {
            return (
                <div className="text-center relative">
                    <div className="absolute top-48">
                        <p className="text-5xl py-2">File downloaded. Please check your downloads folder.</p>
                        <p className="text-xl py-2">note: this file can only be downloaded once per click if you want to redownload the file again, please refresh the page and proceed to download again.</p>
                        <iframe 
                            className='hidden'
                            src={path} 
                        />
                    </div>
                </div>
            )
        }
    }
    return (
        <div>
            {renderFileViewer(filePath)}
        </div>
    )
}

function EmployeesLogs(){
    const [ date_today, set_date_today ] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [ userLog, setUserLogs ] = useState([])
    const [ show, setShow ] = useState(false)
    const [ showPrnt, setShowPrnt ] = useState(false)
    const [ file, setFile ] = useState("")
    const [ loading, setLoading ] = useState(true)
    const componentRef = useRef()

    const fetchUserLogs = () => {
        try {
            http.get('/api/getuserlogtoday').then(response => {
                    setUserLogs(response.data)
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUserLogs()
        setTimeout(() => {
            setLoading(false)
        }, 2500)
    },[])

    const setFilePath = (el) => {
        setFile(el)
        setShow(true)
    }

    const closeModal = (e) => {
        e.preventDefault()
        setShow(false)
    }

    const openModalPrnt = (e) => {
        e.preventDefault()
        setShowPrnt(true)
    }

    const closeModalPrnt = (e) => {
        e.preventDefault()
        setShowPrnt(false)
    }

    const handleInputChange = (e) => {
        const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD')
        set_date_today(newDate)
        const data = {
            date: newDate
        }
        setTimeout(() => {
            http.post('/api/getuserlogfortheday', data).then(response => {
                setUserLogs(response.data.userlog)
            })
        }, 100)
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
            <Modal show={show} handleClose={closeModal}>
                <FileViewer filePath={file} />
            </Modal>
            <Modal show={showPrnt} handleClose={closeModalPrnt}>
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
                    <div className="text-center text-3xl font-sans font-bold pt-10"> DTR of WFH Employees </div>
                    <div className="text-center text-xl font-sans font-bold pb-10"> For {moment(date_today).format('LL')} </div>
                    <table className="table w-full">
                        <thead className="bg-slate-300">
                            <tr>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[5%]" rowSpan={2}> # </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[20%]" rowSpan={2}> Name </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[35%]" rowSpan={2}> Divison/Unit </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[15%]" colSpan={2}> Morning </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[15%]" colSpan={2}> Afternoon </th>
                            </tr>
                            <tr>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> IN </th>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> OUT </th>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> IN </th>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> OUT </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userLog.map((value, ndx) => 
                                <tr className="hover:cursor-pointer hover:bg-slate-400 hover:text-white" key={ndx}>
                                    <td className="border-2 border-black p-1 text-xl text-center"> {ndx+1} </td>
                                    <td className="border-2 border-black p-1 text-xl"> {value.employee_lname}, {value.employee_fname} {value.employee_minitial} {value.employee_suffix} </td>
                                    <td className="border-2 border-black p-1 text-xl"> {value.employee_division} / <br/> {value.employee_unit} </td>
                                    <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timein} </td>
                                    <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timeout} </td>
                                    <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timein} </td>
                                    <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timeout} </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[90%] mx-auto p-5">
                <div className="flex justify-between font-sans font-bold pb-10 sticky -top-5 bg-slate-300">
                    <div className="text-4xl"> Employee Logs </div>
                    <div className="text-2xl"> 
                        Filter by date: <input className="border-2 border-black " type="date" name="date_today" value={date_today} onChange={handleInputChange}/>
                    </div>
                </div>
                <div className="flex justify-between py-3">
                    <button onClick={openModalPrnt} className="mb-3 p-2 border-2 bg-black text-white font-bold border-black rounded-xl shadow-md hover:!bg-slate-300 hover:!text-black">
                        Print Table
                    </button>
                    <ExportToCSV elements={userLog} />
                </div>
                <table className="table w-full">
                    <thead className="bg-slate-300">
                        <tr>
                            <th className="outline outline-1 border-2 border-black p-2 text-4xl" colSpan={8}> Date: {moment(date_today).format('LL')} </th>
                        </tr>
                        <tr>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[5%]" rowSpan={2}> # </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[20%]" rowSpan={2}> Name </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[35%]" rowSpan={2}> Divison/Unit </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[15%]" colSpan={2}> Morning </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[15%]" colSpan={2}> Afternoon </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[10%]" rowSpan={2}> File Attachment </th>
                        </tr>
                        <tr>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> IN </th>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> OUT </th>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> IN </th>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> OUT </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userLog.map((value, ndx) => 
                            <tr className="hover:cursor-pointer hover:bg-slate-400 hover:text-white" key={ndx}>
                                <td className="border-2 border-black p-1 text-xl text-center"> {ndx+1} </td>
                                <td className="border-2 border-black p-1 text-xl"> {value.employee_lname}, {value.employee_fname} {value.employee_minitial} {value.employee_suffix} </td>
                                <td className="border-2 border-black p-1 text-xl"> {value.employee_division} / <br/> {value.employee_unit} </td>
                                <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timein} </td>
                                <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timeout} </td>
                                <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timein} </td>
                                <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timeout} </td>
                                <td className="border-2 border-black p-1 text-xl text-center">
                                    {value.attachment ? 
                                        <button onClick={() => setFilePath(value.attachment)} className="w-full py-2 border hover:bg-slate-500"> 
                                            <i className="fas fa-file-download"></i>
                                        </button> : ""
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default EmployeesLogs