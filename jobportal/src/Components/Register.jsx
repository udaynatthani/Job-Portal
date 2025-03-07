import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { app } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [userType, setUserType] = useState('student'); // Toggle between student and employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    studentId: '', // Only for students
    employeeId: ' ', // Only for employees
    resume: '', // Added resume field
  });

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (userType === 'student' && !formData.studentId) {
      toast.error('Please enter your Student ID');
      return;
    }

    if (userType === 'employee' && !formData.employeeId) {
      toast.error('Please enter your Employee ID');
      return;
    }

    if (!formData.resume) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = [...existingUsers, { ...formData, userType }];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 ${userType === 'student' ? 'bg-indigo-500 text-white' : 'bg-gray-200'} rounded-l-lg`}
            onClick={() => setUserType('student')}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 ${userType === 'employee' ? 'bg-indigo-500 text-white' : 'bg-gray-200'} rounded-r-lg`}
            onClick={() => setUserType('employee')}
          >
            Employee
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {userType === 'student' && (
            <div className="mb-4">
              <label className="block mb-1">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          {userType === 'employee' && (
            <div className="mb-4">
              <label className="block mb-1">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1">Resume</label>
            <input
              type="file"
              name="resume"
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
            Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-500">Login</a>
        </p>
      </div>
    </section>
  );
};

export default Register;
