import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import Card from './Card';
import React from 'react';
const HomeCards = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-indigo-600 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';
  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold">For Students</h2>
            <p className="mt-2 mb-4">
              Browse our jobs and start your career today
            </p>
            {user ? (
              <NavLink
                to="/jobs"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
              >
                Find Jobs
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
              >
                Find Jobs
              </NavLink>
            )}
          </Card>

          <Card bg="bg-indigo-100">
            <h2 className="text-2xl font-bold">For Employers</h2>
            <p className="mt-2 mb-4">
              List your job to find the perfect developer for the role
            </p>
            {user ? (
              <NavLink
                to="/add-job"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
              >
                Post a Job
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
              >
                Post a Job
              </NavLink>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
