import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Brand from './Brand.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { NAV_ITEMS } from '../lib/nav.js';

const linkClass = ({ isActive }) =>
    `btn btn-sm btn-ghost gap-2 font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-base-content/70 hover:text-base-content'}`;

const Navbar = () => {
    return (
        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/80 backdrop-blur">
            <nav className="navbar mx-auto max-w-6xl px-4">
                <div className="flex-none lg:hidden">
                    <label htmlFor="app-drawer" aria-label="Open menu" className="btn btn-square btn-ghost">
                        <Menu className="h-5 w-5" />
                    </label>
                </div>
                <div className="flex-1 px-2">
                    <Brand />
                </div>
                <ul className="hidden items-center gap-1 lg:flex">
                    {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                        <li key={to}>
                            <NavLink to={to} end={end} className={linkClass}>
                                <Icon className="h-4 w-4" />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="ml-2 flex-none">
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}

export default Navbar;
