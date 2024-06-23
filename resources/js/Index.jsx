import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Cookies from 'universal-cookie'
import { 
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'

import { GlobalContext } from './components/GlobalContext'
import Main from './Router'
import LoginPage from './pages/LoginPage'

import '../css/app.css'

function Index() {
    const cookies = new Cookies()
    const [ userDetails, setuserDetails ] = useState("")
    return (
        <Router>
            <GlobalContext.Provider value={{ userDetails, setuserDetails }}>
                <Routes>
                    <Route path="/*" element = {
                        cookies.get('session_token') ?
                            <Main/> : <LoginPage/>
                        } 
                    />
                </Routes>
            </GlobalContext.Provider>
        </Router>
    )
}

export default Index

if (document.getElementById('app')) {
    createRoot(document.getElementById("app")).render(<Index/>)
}
