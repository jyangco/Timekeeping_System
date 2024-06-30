import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import http from "../components/Config"
import { GlobalContext } from '../components/GlobalContext'
import Layout from '../components/Layout'

function PasswordChange(){
    const { userDetails, setuserDetails }  = useContext(GlobalContext)
    const [ changePass, setChangePass ] = useState({
        old_pass: "",
        new_pass: "",
        confirm_pass: "",
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [password_match, setPassword_match] = useState(true)

    const handleInputChange = (e) => {
        e.persist()
        setChangePass({...changePass, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        setPassword_match(changePass.new_pass === changePass.confirm_pass);
    }, [changePass.new_pass, changePass.confirm_pass]);

    const savepassword = async(e) => {
        e.preventDefault()
        const data = {
            employee_id: userDetails.employee_id,
            new_pass: changePass.new_pass,
            old_pass: changePass.old_pass,
            confirm_pass: changePass.confirm_pass,
        }
        try {
            const response = await http.post('/api/passwordchange', data)
            if (response.data.status == 200) {
                Swal.fire({
                    icon: "success",
                    text: (response.data.message),
                })
                resetInput()
            } else if (response.data.status == 304){
                resetInput()
                Swal.fire({
                    icon: "info",
                    text: (response.data.message),
                })
            } else if (response.data.status == 401){
                resetInput()
                Swal.fire({
                    icon: "warning",
                    text: (response.data.message),
                })
            } else {
                resetInput()
                Swal.fire({
                    icon: "error",
                    text: (response.data.validation_errors),
                })
            }
        } catch (error) {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "error",
            })
        }
    }

    const resetInput = () => {
        setChangePass({
            old_pass: "",
            new_pass: "",
            confirm_pass: "",
        })
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
        if (file && allowedTypes.includes(file.type)) {
            setSelectedImage(file)
            setErrorMessage('')
        } else {
            setSelectedImage(null)
            setErrorMessage('Please select a valid image file (JPEG, JPG, PNG, or GIF).')
        }
    }

    const handleUploadImages = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('image_path', selectedImage)
        data.append('employee_id', userDetails.employee_id)
        http.post('/api/uploadbackground', data)
        .then((response) => {
            if (response.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: (response.data.message),
                    text: "image uploaded!, the page will reload"
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        })
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "error",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    const handleRemoveImage = (e) => {
        e.preventDefault()
        const data = {
            employee_id: userDetails.employee_id
        }
        http.post('/api/removebackground', data)
        .then((response) => {
            if (response.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: (response.data.message),
                    text: "image removed! the page will reload"
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        })
        .catch(error => {
            Swal.fire({
                title: (error.code),
                text: (error.message),
                icon: "error",
            })
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    }

    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto min-h-[60vh] w-[85%] mx-auto p-5 relative">
            <Link to={'/dashboard'} className="text-lg"> <i className="fas fa-arrow-alt-left"></i> </Link>
                <div className="flex h-fit">
                    <div className="w-[50%] p-2 border-r-2 border-black">
                        <div className="text-4xl font-sans font-bold pb-10"> Change Password</div>
                        <div className="w-full text-2xl">
                            <div className="p-4">
                                <div className="form-group py-2 flex justify-between flex-wrap">
                                    <label className="p-2 font-semibold" htmlFor="old_pass"> Old Password: </label>
                                    <input
                                        className=" p-1 rounded-lg border border-black w-100" 
                                        type="password" 
                                        name="old_pass"
                                        value={changePass.old_pass}
                                        onChange={handleInputChange}
                                    />
                                    <div className={`text-sm w-full flex justify-end ${changePass.old_pass.length < 8 ? "text-red-500" : "text-green-500"}`}>
                                        This field must contain at least 8 characters
                                    </div>
                                </div>
                                <div className="form-group py-2 flex justify-between flex-wrap">
                                    <label className="p-2 font-semibold" htmlFor="new_pass"> New Password: </label>
                                    <input
                                        className=" p-1 rounded-lg border border-black w-100" 
                                        type="password" 
                                        name="new_pass"
                                        value={changePass.new_pass}
                                        onChange={handleInputChange}
                                    />
                                    <div className={`text-sm w-full flex justify-end ${changePass.new_pass.length < 8 ? "text-red-500" : "text-green-500"}`}>
                                        This field must contain at least 8 characters
                                    </div>
                                </div>
                                <div className="form-group py-2 flex justify-between flex-wrap">
                                    <label className="p-2 font-semibold" htmlFor="confirm_pass"> Confirm Password: </label>
                                    <input
                                        className=" p-1 rounded-lg border border-black w-100" 
                                        type="password" 
                                        name="confirm_pass"
                                        value={changePass.confirm_pass}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={`w-full flex flex-wrap ${changePass.confirm_pass.length == 0 ? "hidden" : "visible"}`}>
                                    <div className={`w-full flex justify-end ${password_match ? "text-sm text-green-500 text-start" : "text-sm text-red-500 text-start"}`}>
                                        Password { password_match ? "matched" : "does not match"} 
                                    </div>
                                    <div className={`w-full flex justify-end text-sm ${changePass.confirm_pass.length < 8 ? "text-red-500" : "text-green-500"}`}>
                                        Password must contain at least 8 characters
                                    </div>
                                </div>
                                <div className="flex justify-center my-10">
                                    <button onClick={savepassword}
                                    disabled={
                                        password_match && 
                                        changePass.new_pass.length >= 8 && 
                                        changePass.confirm_pass.length >= 8 &&
                                        changePass.old_pass.length >= 8 ? 
                                        false : true
                                    }
                                    className={ 
                                        `bg-green-500 py-3 px-3 text-white text-2xl mobile-lg:!text-lg rounded-lg w-[75%]
                                        ${password_match && 
                                        changePass.new_pass.length >= 8 && 
                                        changePass.confirm_pass.length >= 8 &&
                                        changePass.old_pass.length >= 8 ? 
                                            "hover:shadow-2xl" : 
                                            "opacity-50 hover:cursor-not-allowed hover:shadow-none"
                                        }`
                                    }>
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[50%] p-2 border-l-2 border-black">
                        <div className="text-4xl font-sans font-bold pb-10"> Change Background </div>
                        <p className="text-xl"> note: make sure the image name has no white spaces(blanks) </p>
                        {userDetails.background == null   ? 
                            <div className="contents">
                                <form encType="multipart/form-data" onSubmit={handleUploadImages}>
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/gif, image/jpg"
                                        onChange={handleFileChange}
                                    />
                                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                                    <button disabled={ selectedImage ? false : true } type="submit"
                                        className={
                                            `bg-green-500 py-3 px-3 text-white text-2xl mobile-lg:!text-lg rounded-lg
                                            ${selectedImage ?
                                                "hover:shadow-2xl" : 
                                                "opacity-50 hover:cursor-not-allowed hover:shadow-none"
                                            }`
                                    }>
                                        Upload Image
                                    </button>
                                </form>
                                {selectedImage && (
                                    <div className="contents">
                                        <div className="text-2xl font-sans font-semibold">Preview:</div>
                                        <div className="flex justify-center">
                                            <img className="h-[300px] w-[600px]"
                                                src={URL.createObjectURL(selectedImage)}
                                                alt="Selected"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div> : 
                            <div className="contents">
                                <div className="text-2xl font-sans font-semibold pt-5 pb-10">To change background, remove the existing and upload new one.</div>
                                <div className="flex justify-center">
                                    <button className='border text-2xl font-bold rounded-lg border-2 border-black bg-white p-4' onClick={handleRemoveImage}>
                                        REMOVE BACKGROUND
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PasswordChange