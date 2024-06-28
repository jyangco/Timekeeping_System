import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie'

import { GlobalContext } from '../components/GlobalContext'
import http from '../components/Config'

function LoginPage() {
    const history = useNavigate()
    const cookies = new Cookies()
    const { userDetails, setuserDetails }  = useContext(GlobalContext)
    const [passwordShown, setPasswordShown] = useState(false)
    const [userInput, setUserInput] = useState({
        username: "",
        password: "",
        error_list: []
    })

    useEffect(() => {
        if (cookies.get('session_token')){
            history("/dashboard")
        } else {
            history("/")
        }
    }, [])

    const handleInputChange = (e) => {
        e.persist()
        setUserInput({...userInput, [e.target.name]: e.target.value })
    }

    const login = async(e) => {
        e.preventDefault()
        const data = {
            username: userInput.username,
            password: userInput.password
        }
        const res = await http.post('/api/login', data)
        if (res.data.status === 200) {
            const token = res.data.token
            cookies.set('session_token', token, {
                path: '/', 
                secure: true, 
                sameSite: 'strict',
                maxAge: 1800,
            })
            Swal.fire({
                title: "Successfully Logged In",
                text: "Welcome",
                icon: "success"
            })
            http.get('/api/getuserdetails').then(response => {
                setuserDetails(response.data)
            })
            history("/dashboard")
        } else if (res.data.status === 401) {
            Swal.fire({
                title: res.data.message, 
                text: "username or password is incorrect", 
                icon: "warning"
            })
        } else if (res.data.status === 403) {
            Swal.fire({
                title: res.data.message, 
                text: "this account is inactive", 
                icon: "error"
            })
        } else {
            setUserInput({ error_list: res.data.validation_errors })
        }
    }

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true)
    }

    return (
        <div className="h-screen bg-blue-300 flex flex-col justify-center">
            <div className="container-box w-[30%] mx-auto p-5">
                <div className="text-5xl text-center pb-10 font-sans font-bold"> Welcome </div>
                <form onSubmit={login}>
                    <div className="form-group relative pb-10">
                        <label htmlFor="username" className="absolute -top-3 left-2 font-bold bg-white px-2 rounded-full"> USERNAME </label>
                        <input className="form-control text-xl pt-2 p-1 w-full border-2 border-black" 
                            type="text" 
                            name="username"
                            placeholder="Enter username" 
                            onChange={handleInputChange}
                            value={userInput.username}
                        />
                        <span className="text-red-500"> {userInput.error_list.username} </span>
                    </div>
                    <div className="form-group relative pb-8">
                        <label htmlFor="password" className="absolute -top-3 left-2 font-bold bg-white px-2 rounded-full"> PASSWORD </label>
                        <div className="flex">
                            <input className="form-control text-xl pt-2 p-1 w-full border-2 border-black" 
                                type={passwordShown ? "text" : "password"} 
                                name="password"
                                placeholder="Enter password" 
                                onChange={handleInputChange}
                                value={userInput.password}
                            />
                            <div className="-ms-7 place-self-center" onClick={togglePasswordVisiblity}>
                                <i
                                    className={passwordShown ? "fal fa-eye-slash font-bold" : "fal fa-eye font-bold" }
                                />
                            </div>
                        </div>
                        <span className="text-red-500"> {userInput.error_list.password} </span>
                    </div>
                    <input className="container-box w-full text-3xl font-bold p-2 hover:cursor-pointer hover:!shadow-2xl"
                        type='submit'
                        value={"Log In"}
                    />
                </form>
            </div>
        </div>
    )
}

export default LoginPage