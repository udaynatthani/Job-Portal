import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import MainLayout from "./Layouts/MainLayout";
import HomePage from "./Pages/HomePage";
import JobsPage from "./Pages/JobsPage";
import JobPage from "./Pages/JobPage";
import AddJobPage from "./Pages/AddJobPage";
import EditJobPage from "./Pages/EditJobPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import EmployeeDash from "./Pages/EmployeeDash";

function ProtectedRoute({ element }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? element : <Login />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/jobs" element={<ProtectedRoute element={<JobsPage />} />} />
      <Route path="/jobs/:id" element={<ProtectedRoute element={<JobPage />} />} />
      <Route path="/add-job" element={<ProtectedRoute element={<AddJobPage addJobSubmit={() => {}} />} />} />
      <Route
        path="/edit-job/:id"
        element={<ProtectedRoute element={<EditJobPage updateJobSubmit={() => {}} />} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/employee" element={<EmployeeDash />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
