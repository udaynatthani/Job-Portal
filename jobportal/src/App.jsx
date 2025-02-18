import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import * as React from "react";
import "./App.css";
import MainLayout from "./Layouts/MainLayout";
import HomePage from "./Pages/HomePage";
import JobsPage from "./Pages/JobsPage";
import JobPage from "./Pages/JobPage";
import AddJobPage from "./Pages/AddJobPage";
import EditJobPage from "./Pages/EditJobPage";
import Login from "./Components/Login";
import Register from "./Components/Register";


const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobPage />} />
      <Route path="/add-job" element={<AddJobPage addJobSubmit={() => {}} />} />
      <Route
        path="/edit-job/:id"
        element={<EditJobPage updateJobSubmit={() => {}} />}
      />
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Register" element={<Register />} /> 
    
    </Route>
    
  
  )
);

function App() {
  
  
  return <RouterProvider router={router} />;
}

export default App;