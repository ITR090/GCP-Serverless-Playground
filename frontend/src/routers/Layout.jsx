import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
// components
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const Layout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { pathname } = useLocation();

    // close the mobile drawer and jump to top whenever the page changes
    useEffect(() => {
        setDrawerOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="drawer min-h-screen bg-base-200">
            <input
                id="app-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={drawerOpen}
                onChange={(e) => setDrawerOpen(e.target.checked)}
            />
            <div className="drawer-content flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <div className="drawer-side z-40">
                <label htmlFor="app-drawer" aria-label="Close menu" className="drawer-overlay"></label>
                <Sidebar />
            </div>
        </div>
    )
}

export default Layout
