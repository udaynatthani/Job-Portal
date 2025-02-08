import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

const JobList = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!job) return null; // Prevents crashing if job data is missing

  // Ensure description exists to avoid substring errors
  const description = job.description ? job.description : "No description provided.";

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

            <a
              href="https://forms.google.com/form/your-form-id"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
