import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Components/Websitedesign.css";
import "./Components/DashboardPages.css";
import "./Components/Adminfile.css";
import "./Components/Shoppingfile.css";

import Header from "./Components/Header";
import Login from "./Components/Login";
import Register from "./Components/Registration";

import AdminDashbord from "./Components/AdminDashbord";
import AddCollege from "./Components/adminAddCollege";
import AddAds from "./Components/AddAds";
import AddProduct from "./Components/AdminAddProduct";

import Dashboard from "./Components/Dashboard";
import CommonContent from "./Components/Common";
import General from "./Components/General";
import Job from "./Components/Job";
import Coaching from "./Components/Coching";
import Tiffin from "./Components/Tiffin";
import Entertainment from "./Components/Entertainment";
import Accomodation from "./Components/Accomodation ";
import Mypostask from "./Components/Mypostask";
import Mycardproduct from "./Components/MyCardProduct";
import Myorder from "./Components/Myorder";
import ShopItem from "./Components/Shopping";
import UsedItem from "./Components/UsedItem";
import Learning from "./Components/Learning";
import LearningDetails from "./Components/LearningDetail";

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
            <Route path="general" element={<General />} />
            <Route path="job" element={<Job />} />
            <Route path="coaching" element={<Coaching />} />
            <Route path="tiffin" element={<Tiffin />} />
            <Route path="mypostask" element={<Mypostask />} />
            <Route path="mycard" element={<Mycardproduct />} />
            <Route path="myorder" element={<Myorder />} />
            <Route path="entertainment" element={<Entertainment />} />
            <Route path="Accommodation" element={<Accomodation />} />
            <Route path="learning" element={<Learning />} />
            <Route path="learning-details" element={<LearningDetails />}/>
            <Route path="shop" element={<ShopItem />} />
            <Route path="useditem" element={<UsedItem />} />
          </Route>

          <Route path="/admindashboard/*" element={<AdminDashbord />}>
            <Route path="addcollege" element={<AddCollege />} />
            <Route path="addads" element={<AddAds />} />
            <Route path="addproduct" element={<AddProduct />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
