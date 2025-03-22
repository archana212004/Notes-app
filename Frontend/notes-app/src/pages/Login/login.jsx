import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validEmail } from "../../utills/helper";
import "./LoginForm.css";
import backgroundImage from "../../assets/background.jpg";

const Login = ({ setUser }) => { // Add setUser prop
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validEmail(email)) {
            setError("Please enter a valid Email!!");
            return;
        }
        if (!password) {
            setError("Please enter the password!!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5022/api/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.fullname);
            setUser(data.fullname); // Set user in state
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Login failed:", error);
            setError("Something went wrong!");
        }
    };

    return (
        <>
            <Navbar user={localStorage.getItem("username")} />

            <div
                style={{
                    height: "100vh",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="w-96 border rounded bg-white px-7 py-10 shadow-lg">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl mb-7">Login</h4>

                        <input
                            type="text"
                            placeholder="Email"
                            className="input-box"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

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
        </>
    );
};

export default Login;
