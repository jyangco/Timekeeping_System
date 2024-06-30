import React, { useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import moment from 'moment-timezone'

import { GlobalContext } from '../components/GlobalContext'
import http from '../components/Config'
import Layout from '../components/Layout'
import DateTime from '../components/DateTime'
import Loader from '../components/Loader'

function Dashboard() {
    const { userDetails, setuserDetails }  = useContext(GlobalContext)
    const [ userlogs, setUserLogs ] = useState("")
    const [ attachment, setAttachment ] = useState(null)
    const [error, setError] = useState("")
    const [ loading, setLoading ] = useState(true)
    const [ showbg, setShowbg ] = useState(false)

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
        setTimeout(() => {
            setLoading(false)
        }, 2500)
    },[])

    const setMorningTimeIn = async(e) => {
        e.preventDefault()
        const data = {
            date: moment.tz('Asia/Manila').format('LL'),
            morning_timein: moment.tz('Asia/Manila').format('LT'),
            employee_id: userDetails.employee_id,
        }
        console.log(data)
        try {
            const response = await http.post('/api/setmorningtimein', data)
            setUserLogs(response.data)
            fetchUserLogToday()
            Swal.fire({
                title: response.data.message,
                text: "Welcome",
                icon: "success"
            })
        } catch (error) {
            console.error(error)
        }
    }

    const setMorningTimeOut = async(e) => {
        e.preventDefault()
        const data = {
            morning_timeout: moment.tz('Asia/Manila').format('LT'),
            userlog_id: userlogs.userlog_id,
        }
        try {
            const response = await http.post('/api/setmorningtimeout', data)
            setUserLogs(response.data)
            fetchUserLogToday()
            Swal.fire({
                title: response.data.message,
                text: "Enjoy your break",
                icon: "success"
            })
        } catch (error) {
            console.error(error)
        }
    }

    const setAfternoonTimeIn = async(e) => {
        e.preventDefault()
        const data = {
            afternoon_timein: moment.tz('Asia/Manila').format('LT'),
            userlog_id: userlogs.userlog_id,
        }
        try {
            const response = await http.post('/api/setafternoontimein', data)
            setUserLogs(response.data)
            fetchUserLogToday()
            Swal.fire({
                title: response.data.message,
                text: "Hope you enjoyed your break",
                icon: "success"
            })
        } catch (error) {
            console.error(error)
        }
    }

    const setAfternoonTimeOut = async(e) => {
        e.preventDefault()
        const data = new FormData()
            data.append('afternoon_timeout', moment.tz('Asia/Manila').format('LT')),
            data.append('userlog_id', userlogs.userlog_id),
            data.append('attachment', attachment)
        try {
            const response = await http.post('/api/setafternoontimeout', data)
            setUserLogs(response.data)
            fetchUserLogToday()
            Swal.fire({
                title: response.data.message,
                text: "Enjoy the rest of your day",
                icon: "success"
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddFile = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
        const fileSize = selectedFile.size
        const minSize = 12 * 1024
            if (fileSize < minSize) {
                setError('This is a blank file / if not, make sure it is above 12Kb')
                setAttachment(null)
            } else {
                setAttachment(selectedFile)
                setError('')
            }
        }
    }

    if (loading) {
        return(
            <Layout>
                <Loader/>
            </Layout>
        )
    }

    const toggleBackgroundVisibility = () => {
        setShowbg(showbg ? false : true)
    }

    return (
        <Layout>
            <button className="absolute top-[70px] bg-white m-3 p-3 rounded-3xl font-bold" onClick={toggleBackgroundVisibility}>
                {showbg ? <span> Show Dashboard </span> : <span> Hide Dashboard </span> }
            </button>
            <div className={`${showbg ? "invisible" : "visible"} container-box mt-20 overflow-auto max-h-[80vh] w-[85%] mx-auto p-5`}>
                <div className="flex">
                    <div className="w-[40%] border-r-2 border-black p-3">
                        <div className="text-center text-5xl pb-12 font-mono font-bold"> WFH Timekeeping System </div>
                        <div className="form-group py-2">
                            <div className="text-2xl font-bold font-sans"> <DateTime/> </div>
                        </div>
                        <div className="form-group py-2">
                            <label className="text-xl font-semibold"> Name: </label>
                            <div className="text-2xl font-bold font-sans"> {userDetails.employee_fname} {userDetails.employee_minitial} {userDetails.employee_lname} {userDetails.employee_suffix} </div>
                        </div>
                        <div className="form-group py-2">
                            <label className="text-xl font-semibold"> Division: </label>
                            <div className="text-2xl font-bold font-sans"> {userDetails.employee_division} </div>
                        </div>
                        <div className="form-group py-2">
                            <label className="text-xl font-semibold"> Unit: </label>
                            <div className="text-2xl font-bold font-sans"> {userDetails.employee_unit} </div>
                        </div>
                        <div className="flex justify-between py-3">
                            <Link to={'/my-log-history'} state={{ employee_id: `${userDetails.employee_id}` }} className="p-2 border-2 border-black rounded-xl shadow-md hover:!bg-black hover:!text-white"> 
                                Log History <i className="fas fa-history"></i> 
                            </Link><Link to="/password-change" className="p-2 border-2 border-black rounded-xl shadow-md hover:!bg-black hover:!text-white"> 
                                User settings <i className="fas fa-users-cog"></i> 
                            </Link>
                        </div>
                    </div>
                    <div className="w-[60%] border-l-2 bordet-bold p-3 relative">
                        {userDetails.schedule != moment.tz('Asia/Manila').format('dddd') ? 
                            <div className="absolute font-semibold text-7xl top-[30%] text-center">
                                Today is not your WFH Schedule
                            </div>
                        : userlogs == "" ? 
                        //FOR USER TIME IN
                            <div className="contents">
                                <div className="text-4xl text-center font-semibold py-5"> <i className="fas fa-alarm-exclamation"></i> You have no Time In today </div> 
                                <button onClick={setMorningTimeIn} className="hover:shadow-2xl timein-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                    <i className="fas fa-alarm-clock"></i> TIME IN 
                                </button>
                            </div>
                        : userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout == "" ?
                        //FOR USER START OF BREAK
                        <div className="contents">
                            <div className="flex justify-center text-5xl text-blue-500">
                                <i className="fas fa-user-clock"></i>
                            </div>
                            <div className="flex justify-between text-4xl text-center font-semibold py-5"> 
                                <span> Your Time In today is </span> <span> {userlogs.morning_timein} </span>
                            </div> 
                            <button onClick={setMorningTimeOut} className="hover:shadow-2xl timein-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                <i className="fas fa-mug"></i> START BREAK
                            </button>
                        </div> 
                        : userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout != "" && userlogs.afternoon_timein == "" ?
                        //FOR USER END OF BREAK
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
                            <button onClick={setAfternoonTimeIn} className="hover:shadow-2xl timeout-box text-4xl p-5 font-bold absolute bottom-0 right-0">
                                <i className="fas fa-mug"></i> END BREAK
                            </button>
                        </div> 
                        : userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout != "" && userlogs.afternoon_timein != "" && userlogs.afternoon_timeout == "" ?
                        //FOR USER TIME OUT
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
                            <form encType="multipart/form-data">
                                {attachment == null ? 
                                    <span className="text-red-500 text-base float-left font-bold"> *Upload your output to Time Out </span> : 
                                    <span className="text-green-500 text-base float-left font-bold"> *You can now Time Out </span>
                                }
                                <input className="w-full text-3xl pb-4 hover:!cursor-pointer" 
                                    type="file" 
                                    onChange={handleAddFile}
                                />
                                <div className="text-red-500 font-semibold float-left"> {error} </div>
                            </form> <br />
                            <div className="text-sky-700 text-lg w-full"> *File name format <br /> (last name)_(date today)_Accomplishment <br /> 
                                e.g {userDetails.employee_lname}_{moment.tz('Asia/Manila').format("LL")}_Accomplishment
                            </div>
                            <button onClick={setAfternoonTimeOut} 
                                className={attachment == null ? 
                                    "hover:cursor-not-allowed timeout-box text-4xl p-5 font-bold absolute bottom-0 right-0 opacity-50" :
                                    "hover:shadow-2xl timeout-box text-4xl p-5 font-bold absolute bottom-0 right-0"
                                }
                                disabled={attachment == null ? true : false}
                            >
                                <i className="fas fa-alarm-clock"></i> TIME OUT
                            </button>
                        </div> : 
                        userlogs != "" && userlogs.morning_timein != "" && userlogs.morning_timeout != "" && userlogs.afternoon_timein != "" && userlogs.afternoon_timeout != "" ?
                        //DISPLAYING OF USER LOG FOR THE DAY
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
                        </div> : ""
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard