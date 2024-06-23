import React from 'react'
import { Routes, Route  } from "react-router-dom"

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

const Main = (props) =>(
    <Routes>
        <Route path="/" element={ <LoginPage/> }/>
        <Route path="/Dashboard" element={ <Dashboard/> }/>
    </Routes>
)

export default Main