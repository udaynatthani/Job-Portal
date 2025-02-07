import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { app } from '../firebase'; // Import your Firebase configuration

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app); // Initialize Firebase Authentication
  const provider = new GoogleAuthProvider(); // Initialize Google Auth Provider

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      navigate('/jobs');
    } catch (error) {
      setError('Invalid email or password!');
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success('Google sign in successful!');
      navigate('/jobs');
    } catch (error) {
      setError('Google sign in failed!'); 
      toast.error(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      setError('Failed to send password reset email!');
      toast.error(error.message);
    }
  };

  return (
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
            <p className="text-right mt-2 text-blue-500">
             <button onClick={handleResetPassword}>Forgot Password?</button>
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Sign in with Google
        </button>

        {/* <button
          onClick={handleResetPassword}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Reset Password
        </button> */}

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
