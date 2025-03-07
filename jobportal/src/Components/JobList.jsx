import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const JobList = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [user, setUser] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('not-applied');
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [formData, setFormData] = useState({
    phone: '',
    resume: '',
    experience: ''
  });

  if (!job) return null;

  const description = job.description || "No description provided.";

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (user) {
        const q = query(collection(db, 'jobApplications'), where('userId', '==', user.uid), where('jobId', '==', job.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setApplicationStatus('applied');
        }
      }
    };

    fetchApplicationStatus();
  }, [user, job.id]);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleApplyNow = () => {
    if (user) {
      setShowForm(true); // Show the application form
    } else {
      alert('Please log in to apply for this job.');
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.resume || !formData.experience) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'jobpending'), {
        jobId: job.id,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        phone: formData.phone,
        resume: formData.resume,
        experience: formData.experience,
        jobTitle: job.title,
        jobLocation: job.location,
        createdAt: new Date(),
      });

      alert('Application submitted successfully!');
      setApplicationStatus('applied');
      setShowForm(false); // Close the form after submission
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md relative">
      <div className="p-4">
        <div className="mb-6">
          <div className="text-gray-600 my-2">{job.type || "Unknown Type"}</div>
          <h3 className="text-xl font-bold">{job.title || "Untitled Job"}</h3>
        </div>

        <div className="mb-3">
          {showFullDescription ? description : `${description.substring(0, 95)}...`}
        </div>

        <button
          onClick={() => setShowFullDescription((prev) => !prev)}
          className="text-indigo-500 mb-5 hover:text-indigo-600"
        >
          {showFullDescription ? "Less" : "More"}
        </button>

        <h3 className="text-indigo-500 mb-2">{job.salary ? `${job.salary} / Year` : "Salary Not Disclosed"}</h3>
        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-4">
          <div className="text-orange-700">
            <FaLocationDot className="inline mr-2 mb-1 text-lg" />
            {job.location || "Location Not Specified"}
          </div>

          <div className="flex gap-2">
            <Link
              to={`/jobs/${job.id}`}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
            >
              Read More
            </Link>

            {applicationStatus === 'not-applied' ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                onClick={handleApplyNow}
              >
                Apply Now
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                disabled
              >
                Applied
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>

            <form onSubmit={handleSubmitApplication}>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Resume Link:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Experience (in years):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Submit Application
                </button>

                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
