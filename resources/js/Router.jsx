import React from 'react'
import { Routes, Route  } from "react-router-dom"

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import EmployeesList from './pages/EmployeesList'
import EmployeesLogs from './pages/EmployeesLogs'
import NewUser from './pages/NewUser'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployeeLogs from './pages/EmployeeLogs'
import PasswordChange from './pages/PasswordChange'
import NotFound from './pages/NotFound'

const Main = (props) =>(
    <Routes>
        <Route exact={true} path="/" element={ <LoginPage/> }/>
        <Route exact={true} path="/dashboard" element={ <Dashboard/> }/>
        <Route exact={true} path="/employees" element={ <EmployeesList/> }/>
        <Route exact={true} path="/employees/:id" element={ <EmployeeProfile/> }/>
        <Route exact={true} path="/employees/:id/logs" element={ <EmployeeLogs/> }/>
        <Route exact={true} path="/employees/new" element={ <NewUser/> }/>
        <Route exact={true} path="/employee-logs" element={ <EmployeesLogs/> }/>
        <Route exact={true} path="/password-change" element={ <PasswordChange/> }/>
        <Route exact={true} path="*" element={ <NotFound/> }/>
    </Routes>
)

export default Main