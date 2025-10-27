import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Components/Websitedesign.css";
import "./Components/DashboardPages.css"
import Header from "./Components/Header";
import Login from "./Components/Login";
import Register from "./Components/Registration";
import Dashboard from "./Components/Dashboard";
import CommonContent from "./Components/Common";
import Job from "./Components/Job";
import Coaching from "./Components/Coching";
import Tiffin from "./Components/Tiffin";
import Entertainment from "./Components/Entertainment";
import Mypostask from "./Components/Mypostask";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="common" element={<CommonContent />} /> 
            <Route path="job" element={<Job />} />
            <Route path="coaching" element={<Coaching />} />
            <Route path="tiffin" element={<Tiffin />} />
            <Route path="mypostask" element={<Mypostask />} />
            <Route path="entertainment" element={<Entertainment />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;