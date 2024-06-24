import React, { useContext, useState, useEffect} from 'react'
import Swal from 'sweetalert2'
import moment from 'moment'

import { GlobalContext } from '../components/GlobalContext'
import http from '../components/Config'
import Layout from '../components/Layout'
import DateTime from '../components/DateTime'

function Dashboard() {
    const { userDetails, setuserDetails }  = useContext(GlobalContext)
    const [ userlogs, setUserLogs ] = useState("")

    const fetchUserLogToday = async() => {
        try {
            const response = await http.get('/api/getuserlog')
            setUserLogs(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUserLogToday()
    },[])

    const setMorningTimeIn = async(e) => {
        e.preventDefault()
        const data = {
            date: moment(new Date()).format('LL'),
            morning_timein: moment(new Date()).format('LT'),
            employee_id: userDetails.employee_id,
        }
        try {
            const response = await http.post('/api/setmorningtimein', data)
            setUserLogs(response.data)
            fetchUserLogToday()
            Swal.fire({
                title: response.data.message,
                text: "Your Time In today is " + response.data.userlog.morning_timein,
                icon: "success"
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Layout>
            <div className="container-box mt-20 overflow-auto max-h-[80vh] w-[80%] mx-auto p-5">
                <div className="flex">
                    <div className="w-[40%] border-r-2 border-black p-3">
                        <div className="text-center text-5xl pb-12 font-mono font-bold"> WFH Timekeeping System </div>
                        <div className="form-group py-2">
                            <div className="text-2xl font-bold font-sans"> <DateTime/> </div>
                        </div>
                        <div className="form-group py-2">
                            <label className="text-xl font-semibold"> Name: </label>
                            <div className="text-2xl font-bold font-sans"> {userDetails.employee_fname} {userDetails.employee_minitial}. {userDetails.employee_lname} </div>
                        </div>
                        <div className="form-group py-2">
                            <label className="text-xl font-semibold"> Division: </label>
                            <div className="text-2xl font-bold font-sans"> {userDetails.employee_division} </div>
                        </div>
                        <div className="form-group py-2">
                            <label className="text-xl font-semibold"> Unit: </label>
                            <div className="text-2xl font-bold font-sans"> {userDetails.employee_unit} </div>
                        </div>
                    </div>
                    <div className="w-[60%] border-l-2 bordet-bold p-3 relative">
                        {userDetails.schedule != moment(new Date()).format('dddd') ? 
                            <div className="absolute font-semibold text-7xl top-[30%] text-center">
                                Today is not your WFH Schedule
                            </div>
                        : userlogs == "" ?
                            <div className="contents">
                                <div className="text-4xl text-center font-semibold py-5"> <i className="fas fa-alarm-exclamation"></i> You have no Time In today </div> 
                                <button onClick={setMorningTimeIn} className="hover:shadow-2xl timein-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                    <i className="fas fa-alarm-clock"></i> TIME IN 
                                </button>
                            </div>
                        : userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout == "" ?
                        <div className="contents">
                            <div className="flex justify-center text-5xl text-blue-500">
                                <i className="fas fa-user-clock"></i>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> Your Time In today is </span> <span> {userlogs.morning_timein} </span>
                            </div> 
                            <button  className="hover:shadow-2xl timein-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                <i className="fas fa-mug"></i> START BREAK
                            </button>
                        </div> : userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout != "" && userlogs.afternoon_timein == "" ?
                        <div className="contents">
                            <div className="flex justify-center text-5xl text-blue-500">
                                <i className="fas fa-user-clock"></i>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> Your Time In today is </span> <span> {userlogs.morning_timein} </span>
                            </div> 
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> You started your break in </span> <span> {userlogs.morning_timeout} </span>
                            </div>
                            <button  className="hover:shadow-2xl timeout-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                <i className="fas fa-mug"></i> END BREAK
                            </button>
                        </div> : userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout != "" && userlogs.afternoon_timein != "" ?
                            <div className="contents">
                            <div className="flex justify-center text-5xl text-blue-500">
                                <i className="fas fa-user-clock"></i>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> Your Time In today is </span> <span> {userlogs.morning_timein} </span>
                            </div> 
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> You started your break in </span> <span> {userlogs.morning_timeout} </span>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> You ended your break in </span> <span> {userlogs.afternoon_timeout} </span>
                            </div>
                            <button  className="hover:shadow-2xl timeout-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                <i className="fas fa-alarm-clock"></i> TIME OUT
                            </button>
                        </div> : 
                        <div className="contents">
                            <div className="flex justify-center text-5xl text-blue-500">
                                <i className="fas fa-user-clock"></i>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> Your Time In today is </span> <span> {userlogs.morning_timein} </span>
                            </div> 
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> You started your break in </span> <span> {userlogs.morning_timeout} </span>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> You ended your break in </span> <span> {userlogs.afternoon_timein} </span>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> Your Time Out today is </span> <span> {userlogs.afternoon_timeout} </span>
                            </div> 
                        </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard