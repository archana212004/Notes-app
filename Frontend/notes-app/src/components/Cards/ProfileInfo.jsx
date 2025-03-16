import React from "react";
import { getInitials } from "../../utills/helper";

const ProfileInfo = ({ onLogout }) => {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-200 to-purple-300 shadow-lg border border-pink-300">
            {/* Creative Avatar */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold bg-gradient-to-br from-pink-500 to-purple-600 shadow-md transform hover:scale-105 transition-transform duration-300">
                {getInitials("Kanzariya")}
            </div>

            {/* User Info */}
            <div>
                <p className="text-md font-bold text-pink-700">Archana</p>
                <button
                    className="text-xs bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition-colors duration-300"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileInfo;
 