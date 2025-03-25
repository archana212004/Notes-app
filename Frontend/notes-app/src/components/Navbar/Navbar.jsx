import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        alert("Logged out successfully!");
        navigate("/login");
    };

    return (
        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 flex items-center justify-between px-6 py-3 shadow-lg rounded-b-lg">
            <h2 className="text-2xl font-semibold text-white py-2 tracking-wide">
                Notes App
            </h2>

            <button 
                onClick={onLogout} 
                className="bg-white text-red-500 px-4 py-2 rounded hover:bg-red-50 transition-colors"
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;
