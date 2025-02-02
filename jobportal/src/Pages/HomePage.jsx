import Hero from "../Components/Hero"
import HomeCards from "..//Components/HomeCards"
import React from "react"
import JobListings from "../Components/JobListings"
// import ViewAllJobs from "../components/ViewAllJobs"

const HomePage = () => {
  return (
    <>
    <Hero/>
    <HomeCards/>
    <JobListings isHome={true}/>
    {/* <ViewAllJobs/> */}
    </>
  )
}

export default HomePage