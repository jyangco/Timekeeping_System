import React, { useEffect,useState } from "react"
import moment from "moment"
import { Link, useLocation } from "react-router-dom"

import http from '../components/Config'
import Layout from '../components/Layout'
import Modal from "../components/Modal"
import Loader from '../components/Loader'

function EmployeeLogs(){
    const location = useLocation()
    const [ userLog, setUserLogs ] = useState([])
    const [ loading, setLoading ] = useState(true)

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
                <Link to={`/employees/${userLog.user.id}`} state={{ id: `${userLog.user.id}` }} className="text-lg"> <i className="fas fa-arrow-alt-left"></i> </Link>
                <div className="text-4xl font-sans font-bold py-5">
                    {userLog.user.employee_fname} {userLog.user.employee_minitial}. {userLog.user.employee_lname} {userLog.user.employee_suffix}
                </div>
                <div className="text-xl flex justify-between pb-10">
                    <span className="font-bold">Division: {userLog.user.employee_division}</span>
                    <span className="font-bold">Unit: {userLog.user.employee_unit}</span>
                    <span className="font-bold">WFH schedule: {userLog.user.schedule}</span>
                </div>
                <table className="table w-full">
                    <thead className="sticky top-20 bg-slate-300">
                        <tr>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[4%]" rowSpan={2}> # </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[32%]" rowSpan={2}> Date </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[32%]" colSpan={2}> Morning </th>
                            <th className="outline outline-1 border-2 border-black p-1 text-2xl w-[32%]" colSpan={2}> Afternoon </th>
                        </tr>
                        <tr>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> IN </th>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> OUT </th>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> IN </th>
                            <th className="outline outline-1 border-2 border-black p-1 w-48 text-xl"> OUT </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userLog.logs.map((val, ndx) =>
                            <tr key={ndx}>
                                <td className="border-2 border-black p-4 text-center text-2xl"> {ndx+1} </td>
                                <td className="border-2 border-black p-4 text-center text-2xl"> {moment(val.date).format('LL')} </td>
                                <td className="border-2 border-black p-4 text-center text-2xl"> {val.morning_timein} </td>
                                <td className="border-2 border-black p-4 text-center text-2xl"> {val.morning_timeout} </td>
                                <td className="border-2 border-black p-4 text-center text-2xl"> {val.afternoon_timein} </td>
                                <td className="border-2 border-black p-4 text-center text-2xl"> {val.afternoon_timeout} </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default EmployeeLogs