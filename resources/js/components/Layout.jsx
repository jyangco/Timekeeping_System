import React, { useContext } from 'react'

import { GlobalContext } from './GlobalContext'
import Header from './Header'

const Layout = ({ children }) => {
const { userDetails, setuserDetails }  = useContext(GlobalContext)
const image_path = window.location.origin + "/" + userDetails.background
    return (
        <div className={`${image_path ? `bg-[url(${image_path})] bg-cover` : "bg-blue-300"} h-screen bg-blue-300 flex flex-col justify-center relative`}>
            <Header/>
            {children}
        </div>
    )
}

export default Layout