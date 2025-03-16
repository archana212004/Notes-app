import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";

const Navbar = () => {
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername("");
        alert("Logged out successfully!");
        navigate("/login");
    };

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    return (
        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 flex items-center justify-between px-6 py-3 shadow-lg rounded-b-lg">
            <h2 className="text-2xl font-semibold text-white py-2 tracking-wide">
                Notes App
            </h2>

            {username ? (
                <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">{username}</span>
                    <button onClick={onLogout} className="bg-white text-red-500 px-3 py-1 rounded">
                        Logout
                    </button>
                </div>
            ) : (
                <ProfileInfo onLogout={onLogout} />
            )}
        </div>
    );
};

export default Navbar;
