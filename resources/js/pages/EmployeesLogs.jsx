import React, { useEffect, useState } from "react"
import moment from "moment"

import http from '../components/Config'
import Layout from '../components/Layout'
import Modal from "../components/Modal"
import Loader from '../components/Loader'

function EmployeesLogs(){
    const [ date_today, set_date_today ] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [ userLog, setUserLogs ] = useState([])
    // const [ searchResult, setSearchResults ] = useState([])
    // const [ nameInput, setNameInput ] = useState("")
    const [ show, setShow ] = useState(false)
    const [ file, setFile ] = useState("")
    const [ loading, setLoading ] = useState(true)

    const fetchUserLogs = async() => {
        try {
            const response = await http.get('/api/getuserlogtoday')
            setUserLogs(response.data)
            // if (date_today === moment(new Date()).format("YYYY-MM-DD")) {
            //     const response = await http.get('/api/getuserlogtoday')
            //     setUserLogs(response.data)
            // } else {
            //     const data = {
            //         date: date_today
            //     }
            //     setTimeout(() => {
            //         http.post('/api/getuserlogfortheday', data).then(response => {
            //             setUserLogs(response.data.userlog)
            //             setSearchResults(response.data.userlog)
            //         })
            //     }, 100)
            // }
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

    const setFilePath = (el) => {
        setFile(el)
        setShow(true)
    }

    const closeModal = (e) => {
        e.preventDefault()
        setShow(false)
    }

    // const handleSearch = (e) => {
    //     e.preventDefault()
    //     setTimeout(() => {
    //         setSearchResults(
    //             userLog.filter(
    //                 emp => emp.employee_fname.toLowerCase().includes(nameInput.toLowerCase()) ||
    //                 emp.employee_lname.toLowerCase().includes(nameInput.toLowerCase()) ||
    //                 emp.employee_fname.toLowerCase() + " " + emp.employee_lname.toLowerCase() == nameInput.toLowerCase() ||
    //                 emp.employee_lname.toLowerCase() + " " + emp.employee_fname.toLowerCase() == nameInput.toLowerCase()
    //             )
    //         )
    //     }, 5)
    // } 

    // const handleClear = (e) => {
    //     e.preventDefault()
    //     setSearchResults(userLog)
    //     setNameInput("")
    // } 

    // var view = ""
    //     if (searchResult == "" && nameInput.length == 0) {
    //         view = (
    //             <tbody>
    //                 {userLog.map((value, ndx) => 
    //                     <tr key={ndx}>
    //                         <td className="border-2 border-black p-1 text-xl"> {value.employee_fname} {value.employee_minitial}. {value.employee_lname} </td>
    //                         <td className="border-2 border-black p-1 text-xl"> {value.employee_division} / <br/> {value.employee_unit} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timein} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timeout} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timein} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timeout} </td>
    //                     </tr>
    //                 )}
    //             </tbody>
    //         )
    //     } else if (nameInput.length != 0 && searchResult == "") {
    //         view = (
    //             <tbody>
    //                 <tr className='hover:cursor-pointer'>
    //                     <td className="border-2 border-black text-center p-5 text-4xl" colSpan={6}> NO MATCH FOUND </td>
    //                 </tr>
    //             </tbody>
    //         )
    //     } else {
    //         view = (
    //             <tbody>
    //                 {searchResult.map((value,ndx) => 
    //                     <tr key={ndx}>
    //                         <td className="border-2 border-black p-1 text-xl"> {value.employee_fname} {value.employee_minitial}. {value.employee_lname} </td>
    //                         <td className="border-2 border-black p-1 text-xl"> {value.employee_division} / <br/> {value.employee_unit} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timein} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.morning_timeout} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timein} </td>
    //                         <td className="border-2 border-black p-1 text-xl text-center"> {value.afternoon_timeout} </td>
    //                     </tr>
    //                 )}
    //             </tbody>
    //         )
    //     }

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
                <iframe 
                    className='w-[100%] border-4 border-purplehaze' 
                    // src={`https://docs.google.com/gview?url=${encodeURIComponent("/" + file)}&embedded=true`}
                    src={window.location.origin + "/" + file + '#toolbar=1&view=fit'} 
                />
            </Modal>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[90%] mx-auto p-5">
                <div className="flex justify-between font-sans font-bold py-10 sticky -top-5 bg-slate-300">
                    <div className="text-4xl"> Employee Logs </div>
                    <div className="text-4xl">
                        Date: {moment(date_today).format('LL')}
                        {/* <div className="flex p-2 w-[100%]">
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
                        </div> */}
                    </div>
                    <div className="text-2xl"> 
                        Filter by date: <input className="border-2 border-black " type="date" name="date_today" value={date_today} onChange={handleInputChange}/>
                    </div>
                </div>
                <table className="table w-full">
                    <thead className="sticky top-20 bg-slate-300">
                        {/* <tr>
                            <th className="border-2 border-black p-1 text-3xl" colSpan={6}>
                                Date: {moment(date_today).format('LL')}
                            </th>
                        </tr> */}
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
                    {/* {view} */}
                    <tbody>
                        {userLog.map((value, ndx) => 
                            <tr className="hover:cursor-pointer hover:bg-slate-400 hover:text-white" key={ndx}>
                                <td className="border-2 border-black p-1 text-xl text-center"> {ndx+1} </td>
                                <td className="border-2 border-black p-1 text-xl"> {value.employee_fname} {value.employee_minitial}. {value.employee_lname} {value.employee_suffix} </td>
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