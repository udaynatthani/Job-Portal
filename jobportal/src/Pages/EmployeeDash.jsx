import { Link, NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import JobList from '../Components/JobList';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Spinner from '../Components/Spinner';

export default function EmployeeDash({ isHome = false }) { // Set default prop for isHome
    const title = "Employee Dashboard";
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCity, setSearchCity] = useState("");

    useEffect(() => {
      const fetchJobs = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, 'jobs'));
          const jobList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Remove duplicate jobs based on ID
          const uniqueJobs = jobList.filter(
            (job, index, self) => index === self.findIndex((j) => j.id === job.id)
          );

          // Show 3 jobs if isHome is true, otherwise show all
          const jobsToDisplay = isHome ? uniqueJobs.slice(0, 3) : uniqueJobs;

          setJobs(jobsToDisplay);
          setFilteredJobs(jobsToDisplay);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
        setLoading(false);
      };

      fetchJobs();
    }, [isHome]);

    // Handle job search
    const handleSearch = () => {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        job.location.toLowerCase().includes(searchCity.toLowerCase())
      );
      setFilteredJobs(filtered);
    };

    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-white">{title}</h1>
        </div>

        <div className="flex flex-col items-center mt-10">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg w-96 text-center border border-white/30">
            <h2 className="text-2xl font-bold text-white">List your job to find the perfect developer</h2>
            <NavLink
                to="/add-job"
                className="inline-block bg-white text-indigo-600 font-semibold rounded-lg px-5 py-2 hover:bg-indigo-500 hover:text-white transition"
            >
                Post a Job
            </NavLink>
          </div>
        </div>

        {/* Displaying existing jobs */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-10">
          <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-black-500 mb-6 text-center">
              {isHome ? 'Recent Jobs' : 'Your Posted Jobs'}
            </h2>

            {/* {!isHome && (
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search job title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />

                <input
                  type="text"
                  placeholder="Search by city..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />

                <button
                  onClick={handleSearch}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                >
                  Search
                </button>
              </div>
            )} */}

            {loading ? (
              <Spinner loading={loading} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => <JobList key={job.id} job={job} />)
                ) : (
                  <div className="text-center text-gray-600">No jobs available.</div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    );
}
