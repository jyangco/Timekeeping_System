import React from 'react'
import { Routes, Route  } from "react-router-dom"

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import EmployeesList from './pages/EmployeesList'
import EmployeesLogs from './pages/EmployeesLogs'
import NotFound from './pages/NotFound'

const Main = (props) =>(
    <Routes>
        <Route path="/" element={ <LoginPage/> }/>
        <Route path="/dashboard" element={ <Dashboard/> }/>
        <Route path="/employees" element={ <EmployeesList/> }/>
        <Route path="/employee-logs" element={ <EmployeesLogs/> }/>
        <Route path="*" element={ <NotFound/> }/>
    </Routes>
)

export default Main