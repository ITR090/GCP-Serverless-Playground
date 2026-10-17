import React from 'react';
import { NavLink } from 'react-router-dom';
import Brand from './Brand.jsx';
import { NAV_ITEMS } from '../lib/nav.js';

const Sidebar = () => {
    return (
        <aside className="flex min-h-full w-72 flex-col gap-6 bg-base-100 p-5">
            <Brand />
            <ul className="menu w-full gap-1 p-0">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) => `gap-3 py-3 ${isActive ? 'menu-active' : ''}`}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default Sidebar;
