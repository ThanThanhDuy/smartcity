import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div>
            <p>sidebar</p>
            {/* main content */}
            <Outlet />
        </div>
    )
}

export default Layout
