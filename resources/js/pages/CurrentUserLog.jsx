import React, { useEffect, useState, useRef } from "react"
import moment from "moment"
import { Link, useLocation } from "react-router-dom"
import ReactToPrint from 'react-to-print'

import http from '../components/Config'
import Layout from '../components/Layout'
import Loader from '../components/Loader'

function CurrentUserLog(){
    const location = useLocation()
    const [ userLog, setUserLogs ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const componentRef = useRef()

    useEffect(() => {
        const data = {
            employee_id: location.state.employee_id
        }
        const fetchUserLogs = async() => {
            try {
                const response = await http.post('/api/getemployeelogs', data)
                setUserLogs(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUserLogs()
        setTimeout(() => {
            setLoading(false)
        }, 2500)
    },[])

    if (loading) {
        return(
            <Layout>
                <Loader/>
            </Layout>
        )
    }

    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[90%] mx-auto p-5">
                <div className="float-right">
                    <ReactToPrint
                        trigger={ () => {
                            return (
                                <div className="flex justify-center">
                                    <button className="text-xl container-box text-black px-5 py-2 font-bold hover:shadow-2xl"> 
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
                    <div className="text-3xl font-sans font-bold pb-5 pt-5">
                        {userLog.user.employee_fname} {userLog.user.employee_minitial} {userLog.user.employee_lname} {userLog.user.employee_suffix}
                    </div>
                    <div className="text-xl">
                        <div className="p-2 font-semibold"> <span className="font-bold"> Division: </span> {userLog.user.employee_division} </div>
                        <div className="p-2 font-semibold"> <span className="font-bold"> Unit: </span> {userLog.user.employee_unit} </div>
                        <div className="p-2 font-semibold"> <span className="font-bold"> WFH schedule: </span> {userLog.user.schedule} </div>
                    </div>
                    <table className="table w-full">
                        <thead className="sticky top-20 bg-slate-300">
                            <tr>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[4%]" rowSpan={2}> # </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[32%]" rowSpan={2}> Date </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[32%]" colSpan={2}> Morning </th>
                                <th className="outline outline-1 border-2 border-black p-1 text-xl w-[32%]" colSpan={2}> Afternoon </th>
                            </tr>
                            <tr>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-lg"> IN </th>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-lg"> OUT </th>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-lg"> IN </th>
                                <th className="outline outline-1 border-2 border-black p-1 w-48 text-lg"> OUT </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userLog.logs.map((val, ndx) =>
                                <tr key={ndx}>
                                    <td className="border-2 border-black p-4 text-center text-xl"> {ndx+1} </td>
                                    <td className="border-2 border-black p-4 text-center text-xl"> {moment(val.date).format('LL')} </td>
                                    <td className="border-2 border-black p-4 text-center text-xl"> {val.morning_timein} </td>
                                    <td className="border-2 border-black p-4 text-center text-xl"> {val.morning_timeout} </td>
                                    <td className="border-2 border-black p-4 text-center text-xl"> {val.afternoon_timein} </td>
                                    <td className="border-2 border-black p-4 text-center text-xl"> {val.afternoon_timeout} </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}

export default CurrentUserLog