import React from "react";

export default function Card({ children, className = "" }) {
    return (
        <div className={`rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 ${className}`}>
            {children}
        </div>
    )
}
