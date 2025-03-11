import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate(); // Fixing useNavigate usage

    const onLogout = () => {
        navigate("/login");
    };

    const handleSearch = () => {
        // Implement search functionality
    };

    const onClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 flex items-center justify-between px-6 py-3 shadow-lg rounded-b-lg">
            <h2 className="text-2xl font-semibold text-white py-2 tracking-wide">
                Notes App
            </h2>

            <SearchBar
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            <ProfileInfo onLogout={onLogout} />
        </div>
    );
};

export default Navbar;
