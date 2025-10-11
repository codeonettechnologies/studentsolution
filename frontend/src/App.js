import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Components/Websitedesign.css";
import "./Components/DashboardPages.css"
import Header from "./Components/Header";
import Login from "./Components/Login";
import Register from "./Components/Registration";
import Dashboard from "./Components/Dashboard";
import JobContent from "./Components/Common"; 
import Coaching from "./Components/Coching";
import Job from "./Components/Job";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="common" element={<JobContent />} /> 
            <Route path="job" element={<Job />} />
            <Route path="coching" element={<Coaching />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;