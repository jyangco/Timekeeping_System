import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie'

import { GlobalContext } from './GlobalContext'
import http from './Config'

function Header() {
    const cookies = new Cookies()
    const history = useNavigate()
    const { userDetails, setuserDetails }  = useContext(GlobalContext)

    useEffect(() => {
        http.get('/api/getuserdetails').then(response => {
            setuserDetails(response.data)
        })
    }, [])

    const logout = async(e) => {
        e.preventDefault()
        Swal.fire({
            allowOutsideClick: false,
            title: "You are about to Logout",
            text: "Do you wish to proceed?",
            icon: "warning",
            showCancelButton: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Yes',
        })
        .then((result) => {
            if (result.isConfirmed) {
                http.post('/api/logout').then(res => {
                    if (res.data.status === 200) {
                        cookies.remove('session_token', { path: '/', secure: false, sameSite: 'strict' })
                        Swal.fire({
                            title: "Successfully Logged Out",
                            text: res.data.message, 
                            icon: "success"
                        })
                        history("/")
                    } 
                })
            }
        })
    }

    return(
        <nav className="h-20 w-full bg-blue-500 fixed top-0 border-b-2 border-black p-3">
            <div className="h-full w-[90%] mx-auto">
                <div className="flex justify-between">
                    <div className="inline p-3">
                        <Link to="/dashboard" className="p-3 text-2xl text-white text-decoration-none font-bold hover:!text-blue-500 hover:!bg-white rounded-xl" > 
                            <i className="fas fa-home-lg"></i> Dashboard 
                        </Link>
                        <span className={`${userDetails.role === "admin" ? "visible" : "hidden"} text-2xl text-white`}> | </span>
                        <Link to="/employees" className={`${userDetails.role === "admin" ? "visible" : "hidden"} p-3 text-2xl text-white text-decoration-none font-bold hover:!text-blue-500 hover:!bg-white rounded-xl`} > 
                            <i className="fas fa-users"></i> Employees 
                        </Link>
                        <span className={`${userDetails.role === "admin" ? "visible" : "hidden"} text-2xl text-white`}> | </span>
                        <Link to="/employee-logs" className={`${userDetails.role === "admin" ? "visible" : "hidden"} p-3 text-2xl text-white text-decoration-none font-bold hover:!text-blue-500 hover:!bg-white rounded-xl`} > 
                            <i className="fas fa-history"></i> Logs 
                        </Link>
                    </div>
                    <button onClick={logout} className="p-3 text-2xl text-white text-decoration-none font-bold hover:!text-blue-500 hover:!bg-white rounded-xl" > 
                        <i className="fas fa-sign-out"></i>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Header