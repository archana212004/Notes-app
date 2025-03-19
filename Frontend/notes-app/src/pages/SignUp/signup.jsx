import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/input/PasswordInput";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg"; // Background image import

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(""); // Success message state

    const navigate = useNavigate(); // Navigation function

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please enter your name!");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address!");
            return;
        }

        if (!password) {
            setError("Please enter the Password!");
            return;
        }

        setError("");
        
        try {
            // Simulate API call (Replace this with your actual API call)
            setTimeout(() => {
                setSuccessMessage("Signup successful! Redirecting to login...");
                
                setTimeout(() => {
                    navigate("/login"); // Redirect to login after 2 seconds
                }, 2000);
            }, 1000);
        } catch (error) {
            setError("Signup failed. Please try again.");
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
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-7">SignUp</h4>

                        <input
                            type="text"
                            placeholder="Name"
                            className="input-box"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

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
                        {successMessage && <p className="text-green-500 text-xs pb-1">{successMessage}</p>}

                        <button type="submit" className="btn-primary">
                            Create Account
                        </button>

                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary underline">
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
