import React, { useState, useEffect } from "react";
import JobList from "./JobList";
import Spinner from "./Spinner";
import { db } from "../firebase"; // Import Firestore database
import { collection, getDocs } from "firebase/firestore"; // Firestore methods

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Show only 3 jobs on the homepage, otherwise show all
        setJobs(isHome ? jobList.slice(0, 3) : jobList);
      } catch (error) {
        console.error("Error fetching jobs from Firestore:", error);
      }
      setLoading(false);
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
