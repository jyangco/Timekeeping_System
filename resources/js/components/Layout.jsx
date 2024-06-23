import React from 'react'

import Header from './Header'

const Layout = ({ children }) => {
    return (
        <div className="h-screen bg-blue-300 flex flex-col justify-center">
            <Header/>
            {children}
        </div>
    )
}

export default Layout