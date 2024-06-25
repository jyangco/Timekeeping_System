import React, { useState } from "react"
import { Link } from "react-router-dom"

import Layout from '../components/Layout'

function PasswordChange(){
    const [ changePass, setChangePass ] = useState({
        old_pass: "",
        new_pass: "",
        confirm_pass: "",
        password_match: "does not match"
    })

    const handleInputChange = (e) => {
        e.persist()
        setChangePass({...changePass, [e.target.name]: e.target.value })
    }

    const handleConfirmPassword = (e) => {
        e.preventDefault()
        setChangePass({
            ...changePass, [e.target.name]: e.target.value 
        })
        setTimeout(() => {
            if (changePass.confirm_pass != changePass.new_pass || changePass.confirm_pass == "") {
                setChangePass({...changePass,
                    [changePass.password_match]: "does not match"
                })
            } else {
                setChangePass({...changePass,
                    [changePass.password_match]: "match"
                })
            }
        }, 1)
    }

    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto min-h-[60vh] w-[80%] mx-auto p-5 relative">
            <Link to={'/dashboard'} className="text-lg"> <i className="fas fa-arrow-alt-left"></i> </Link>
            <div className="text-4xl font-sans font-bold pb-10"> Change Password</div>
            <div className="flex justify-center">
                    <div className="w-[40%] text-2xl">
                        <div className="p-4">
                            <div className="form-group py-2 flex justify-between">
                                <label className="p-2 font-semibold" htmlFor="old_pass"> Old Password: </label>
                                <input
                                    className=" p-1 rounded-lg border border-black w-100" 
                                    type="password" 
                                    name="old_pass"
                                    value={changePass.old_pass}
                                    onChange={handleInputChange}
                                />
                                {/* <div className={`text-sm ${this.state.old_pass.length < 8 ? "text-red-500" : "hidden"}`}> */}
                                    {/* This field must contain at least 8 characters
                                </div> */}
                            </div>
                            <div className="form-group py-2 flex justify-between">
                                <label className="p-2 font-semibold" htmlFor="new_pass"> New Password: </label>
                                <input
                                    className=" p-1 rounded-lg border border-black w-100" 
                                    type="password" 
                                    name="new_pass"
                                    value={changePass.new_pass}
                                    onChange={handleInputChange}
                                />
                                {/* <div className={`text-sm ${this.state.new_pass.length < 8 ? "text-red-500" : "hidden"}`}>
                                    This field must contain at least 8 characters
                                </div> */}
                            </div>
                            <div className="form-group py-2 flex justify-between">
                                <label className="p-2 font-semibold" htmlFor="confirm_pass"> Confirm Password: </label>
                                <input
                                    className=" p-1 rounded-lg border border-black w-100" 
                                    type="password" 
                                    name="confirm_pass"
                                    value={changePass.confirm_pass}
                                    onChange={handleConfirmPassword}
                                />
                            </div>
                            {/* <div className={`${this.state.confirm_pass.length == 0 ? "hidden" : "visible"}`}>
                                <div className={`${password_match == "match" ? "text-sm text-green-500 text-start" : "text-sm text-red-500 text-start"}`}>
                                    Password {password_match}
                                </div>
                                <div className={`text-sm ${this.state.confirm_pass.length < 8 ? "text-red-500" : "text-green-500"}`}>
                                    Password must contain at least 8 characters
                                </div>
                            </div> */}
                            {/* <div className="flex justify-between my-3">
                                <button onClick={this.handleSavePassword}
                                disabled={
                                    password_match == "match" && 
                                    this.state.new_pass.length >= 8 && 
                                    this.state.confirm_pass.length >= 8 &&
                                    this.state.old_pass.length >= 8 ? 
                                    false : true
                                }
                                className={ 
                                    `bg-green-500 py-2 px-3 text-white text-xl mobile-lg:!text-lg rounded-lg 
                                    ${password_match == "match" && 
                                    this.state.new_pass.length >= 8 && 
                                    this.state.confirm_pass.length >= 8 &&
                                    this.state.old_pass.length >= 8 ? 
                                        "hover:shadow-2xl" : 
                                        "opacity-50 hover:cursor-not-allowed hover:shadow-none"
                                    }`
                                }>
                                    SAVE
                                </button>
                                <button onClick={this.forceClose} className="bg-red-500 py-2 px-3 text-white text-xl mobile-lg:!text-lg rounded-lg hover:shadow-2xl">
                                    CANCEL
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PasswordChange