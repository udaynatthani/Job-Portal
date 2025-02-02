import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import { toast } from 'react-toastify'; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [userType, setUserType] = useState(""); 
  const navigate = useNavigate(); 

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const studentEmail = "student@gmail.com"; 
    const studentPassword = "student123"; 
    const employeeEmail = "employee@gmail.com"; 
    const employeePassword = "employee123";

    if (userType === "student") {
      if (email === studentEmail && password === studentPassword) {
        setError(""); 
        toast.success("Login successful!"); 
        navigate("/jobs"); 
      } else {
        setError("Invalid email or password for student!"); 
      }
    } else if (userType === "employee") {
      if (email === employeeEmail && password === employeePassword) {
        setError(""); 
        toast.success("Login successful!"); 
        navigate("/add-job"); 
      } else {
        setError("Invalid email or password for employee!"); 
      }
    } else {
      setError("Please select your user type."); 
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700">User Type</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                value={userType}
                onChange={(e) => setUserType(e.target.value)} 
                required
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
