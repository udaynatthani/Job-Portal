import { Link, NavLink, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import JobList from '../Components/JobList';
import Spinner from '../Components/Spinner';

export default function EmployeeDash({ isHome = false }) {
  const title = 'Employee Dashboard';
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({
    pending: {},
    accepted: {},
    rejected: {}
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
      fetchApplications(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  const fetchApplications = async (jobs) => {
    const applicationTypes = { pending: {}, accepted: {}, rejected: {} };
    for (const status of ['jobpending', 'acceptjob', 'jobreject']) {
      for (const job of jobs) {
        const q = query(collection(db, status), where('jobId', '==', job.id));
        const querySnapshot = await getDocs(q);
        applicationTypes[status === 'jobpending' ? 'pending' : status === 'acceptjob' ? 'accepted' : 'rejected'][job.id] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    }
    setApplications(applicationTypes);
  };

  const handleApplicationStatus = async (app, currentStatus, newStatus) => {
    try {
      await setDoc(doc(db, newStatus, app.id), { ...app, status: newStatus });
      await deleteDoc(doc(db, currentStatus, app.id));
      fetchApplications(jobs);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleDeleteJob = async (job) => {
    try {
      await setDoc(doc(db, 'deletedjobs', job.id), job);
      await deleteDoc(doc(db, 'jobs', job.id));
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className=" bg-gradient-to-r from-indigo-600 to-purple-600 py-20 min-h-screen flex flex-col">
      <h1 className="text-5xl font-extrabold text-center">{title}</h1>
      <div className="flex flex-col items-center mt-10">
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg w-96 text-center border border-white/30">
          <h2 className="text-2xl font-bold text-white">
            List your job to find the perfect developer
          </h2>
          <NavLink
            to="/add-job"
            className="inline-block bg-white text-indigo-600 font-semibold rounded-lg px-5 py-2 hover:bg-indigo-500 hover:text-white transition"
          >
            Post a Job
          </NavLink>
        </div>
      </div>
      <section className="px-4 py-10">
        {loading ? (
          <Spinner />
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow-md mb-6">
              <JobList job={job} />
              <button 
                onClick={() => handleDeleteJob(job)} 
                className="bg-red-500 text-white px-3 py-1 rounded-md mt-2"
              >
                Delete Job
              </button>
              {['pending', 'accepted', 'rejected'].map((status) => (
                <div key={status} className="mt-4">
                  <h3 className="text-lg font-bold capitalize">{status} Applications:</h3>
                  {applications[status][job.id]?.length ? (
                    <ul className="list-disc ml-5">
                      {applications[status][job.id].map((app) => (
                        <li key={app.id} className="flex justify-between items-center">
                          <span>{app.userName} - {app.userEmail}</span>
                          {status === 'pending' && (
                            <>
                              <button onClick={() => handleApplicationStatus(app, 'jobpending', 'acceptjob')} className="bg-green-500 text-white px-3 py-1 rounded-md">Accept</button>
                              <button onClick={() => handleApplicationStatus(app, 'jobpending', 'jobreject')} className="bg-red-500 text-white px-3 py-1 rounded-md">Reject</button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No {status} applications.</p>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
