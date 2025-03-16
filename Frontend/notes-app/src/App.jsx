import React, { useState } from "react";
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import SignUp from "./pages/SignUp/signup";

function App() {
  const [user,setUser] = useState(localStorage.getItem("username") || "");

  return(
    <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/Login"  element={<Login  setUser={setUser}/>} />
      <Route path="/SignUp" exact element={<SignUp />} />
    </Routes>
  </Router>
  )
}
export default App