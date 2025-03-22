import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder, disabled }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    
    const toggleShowPassword = () => {
        if (!disabled) {
            setIsShowPassword(!isShowPassword);
        }
    };

    return (
        <div className={`flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3 ${disabled ? 'opacity-50' : ''}`}>
            <input
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
                disabled={disabled}
            />
            
            {isShowPassword ? (
                <FaRegEye
                    size={22}
                    className={`cursor-pointer ${disabled ? 'text-gray-400' : 'text-primary hover:text-primary-dark'}`}
                    onClick={toggleShowPassword}
                />
            ) : (
                <FaRegEyeSlash
                    size={22}
                    className={`cursor-pointer ${disabled ? 'text-gray-400' : 'text-slate-400 hover:text-primary'}`}
                    onClick={toggleShowPassword}
                />
            )}
        </div>
    );
};

export default PasswordInput;