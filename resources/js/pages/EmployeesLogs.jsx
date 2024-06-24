import React, { useEffect, useState } from "react"
import moment from "moment"

import http from '../components/Config'
import Layout from '../components/Layout'

function EmployeesLogs(){
    const [ date_today, set_date_today ] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [ userLog, setUserLogs ] = useState([])

    const fetchUserLogs = async(e) => {
        try {
            const response = await http.get('/api/getuserlogtoday')
            setUserLogs(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUserLogs()
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

    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[80%] mx-auto p-5">
                <div className="text-center text-6xl font-sans font-bold"> WFH Timekeeping System </div>
                <div className="flex justify-between font-sans font-bold py-10">
                    <span className="text-4xl"> Employee Logs </span>
                    <span className="text-4xl"> Date: {moment(date_today).format('LL')} </span>
                    <span className="text-2xl"> 
                        <input className="border-2 border-black " type="date" name="date_today" value={date_today} onChange={handleInputChange}/>
                    </span>
                </div>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="border-2 border-black p-2 text-2xl" rowSpan={2}> Name </th>
                            <th className="border-2 border-black p-2 text-2xl" rowSpan={2}> Divison/Unit </th>
                            <th className="border-2 border-black p-2 text-2xl" colSpan={2}> Morning </th>
                            <th className="border-2 border-black p-2 text-2xl" colSpan={2}> Afternoon </th>
                        </tr>
                        <tr>
                            <th className="border-2 border-black p-2 w-48 text-xl"> IN </th>
                            <th className="border-2 border-black p-2 w-48 text-xl"> OUT </th>
                            <th className="border-2 border-black p-2 w-48 text-xl"> IN </th>
                            <th className="border-2 border-black p-2 w-48 text-xl"> OUT </th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Layout>
    )
}

export default EmployeesLogs