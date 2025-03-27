import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const JobList = ({ job }) => {
  const [user, setUser] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('not-applied');

  if (!job) return null;

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

  const handleApplyNow = async () => {
    if (!user) {
      alert('Please log in to apply for this job.');
      return;
    }

    try {
      await addDoc(collection(db, 'jobpending'), {
        jobId: job.id,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        jobTitle: job.title,
        jobLocation: job.location,
        createdAt: new Date(),
      });

      alert('Application submitted successfully!');
      setApplicationStatus('applied');
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
          {job.description ? `${job.description.substring(0, 95)}...` : "No description provided."}
        </div>

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
    </div>
  );
};

export default JobList;
