import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
// auth
import PrivateRoute from './privateRouter/index'
// screens
import Login from '../pages/Login'
import Home from '../pages/Home'
import Layout from '../components/Layout'
import NotFound from '../components/Notfound'

function Router() {
    return (
        <Routes>
            {/* public routes */}
            <Route index element={<Navigate to="home" replace />} />
            <Route path="login" element={<Login />} />

            {/* main layout */}
            <Route path="/" element={<Layout />}>
                {/* private routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="home" element={<Home />} />
                </Route>
            </Route>
            {/* not found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Router
