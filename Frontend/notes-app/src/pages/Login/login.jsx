import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validEmail } from "../../utills/helper";
import { BrowserRouter } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, seterror] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validEmail(email)) {
            seterror("Pleasse enter a valid a Email!!");
            return;
        }
        if (!password) {
            seterror("Please enter the password!!");
            return;
        }
        seterror("")
        //Login API call
    };
    return<>
        <Navbar />

        <div className="flex items-center justify-center mt-28">
            <div className="w-96 border rounded bg-white px-7 py-10">
                <form onSubmit={handleLogin}>
                    <h4 className="text-2xl mb-7">Login</h4>

                    <input type="text"
                    placeholder="Email"
                    className="input-box" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-res-500 text-xs pb-1">{error}</p>}
                    <button type="submit" className="btn-primary">
                        Login
                    </button>

                    <p className="text-sm text-center mt-4">
                        Not Registered yet?{" "}
                        <Link to="/SignUp" className="font-medium text-primary underline">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>;
};

export default Login