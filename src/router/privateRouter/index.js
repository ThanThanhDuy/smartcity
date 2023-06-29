import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import localService from '../../services/local'

function PrivateRoute() {
    const isAuth = localService.getAccessToken() ? true : false

    return isAuth ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
