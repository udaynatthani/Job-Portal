import React, { useState, useEffect } from "react";
import JobList from "./JobList";
import Spinner from "./Spinner";

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
  
      setTimeout(async () => { 
        const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
  
        try {
          const response = await fetch("/jobs.json");
          const jsonJobs = await response.json();
  
          const allJobs = [...jsonJobs, ...storedJobs];
  
          const jobsToDisplay = isHome ? allJobs.slice(0, 3) : allJobs;
  
          setJobs(jobsToDisplay);
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
  
        setLoading(false);
      }, 1000); 
  
    };
  
    fetchJobs();
  }, [isHome]);
  

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobList key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
