import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { app } from '../firebase';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      toast.success('Logged out successfully!');
      navigate('/');
    });
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <nav className="bg-indigo-300 border-b-2 border-indigo-400">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="size-14 rounded-full" src={logo} alt="SB Jobs" />
              <span className="hidden md:block text-indigo-600 text-2xl font-bold ml-2">
                Jobs Portal
              </span>
            </NavLink>
            <div className="md:ml-auto mt-2">
              <div className="flex space-x-2">
                <>
                  <NavLink to="/" className={'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'}>
                    Home
                  </NavLink>
                  {user ? (
                    <NavLink to="/jobs" className={'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'}>
                      Jobs
                    </NavLink>
                  ) : (
                    <NavLink to="/login" className={'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'}>
                      Jobs
                    </NavLink>
                  )}

                  {user ? (
                    <NavLink to="/add-job" className={'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'}>
                      Add Job
                    </NavLink>
                  ) : (
                    <NavLink to="/login" className={'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'}>
                      Add Job
                    </NavLink>
                  )}
                </>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink to="/login" className={'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'}>
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
