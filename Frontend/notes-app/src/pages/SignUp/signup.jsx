import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/input/PasswordInput";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg"; // Background image import

const SignUp = ({ setUser }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); // Navigation function

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");
        setIsLoading(true);

        // Validation
        if (!name.trim()) {
            setError("Please enter your name!");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address!");
            setIsLoading(false);
            return;
        }

        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5022/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    fullname: name.trim(),
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Signup failed!");
            }

            // Store user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.fullname);
            
            if (setUser) {
                setUser(data.fullname);
            }

            setSuccessMessage("Signup successful! Redirecting to dashboard...");
            
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            console.error("Signup error:", error);
            setError(error.message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />

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
                    overflow: "hidden"
                }}
            >
                <div className="w-96 border rounded bg-white px-7 py-10 shadow-lg">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-7 text-center font-semibold text-gray-700">Create Account</h4>

                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input-box"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-box"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create Password"
                            disabled={isLoading}
                        />

                        {error && (
                            <p className="text-red-500 text-sm mb-4 text-center">
                                {error}
                            </p>
                        )}
                        
                        {successMessage && (
                            <p className="text-green-500 text-sm mb-4 text-center">
                                {successMessage}
                            </p>
                        )}

                        <button 
                            type="submit" 
                            className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>

                        <p className="text-sm text-center mt-4 text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email); // Basic email validation
};

export default SignUp;
