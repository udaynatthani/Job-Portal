import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import JobList from "./JobList";
import Spinner from "./Spinner";

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Firestore document ID
          ...doc.data(),
        }));

        const jobsToDisplay = isHome ? jobList.slice(0, 3) : jobList;

        setJobs(jobsToDisplay);
        setFilteredJobs(jobsToDisplay);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [isHome]);

  // 🔎 Search Handler (Title & City)
  const handleSearch = () => {
    let filtered = jobs;

    if (searchTitle) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (searchCity) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>

        {/* 🔍 Search Inputs */}
        {!isHome && (
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search job title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm"
            />

            <input
              type="text"
              placeholder="Search by city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm"
            />

            <button
              onClick={handleSearch}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Search
            </button>
          </div>
        )}

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobList key={job.id} job={job} />
              ))
            ) : (
              <div className="text-center text-gray-600">
                No jobs available.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
