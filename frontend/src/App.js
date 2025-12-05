import { Routes, Route } from "react-router-dom"; 
import "./Components/Websitedesign.css";
import "./Components/DashboardPages.css";
import "./Components/Adminfile.css";
import "./Components/Shoppingfile.css";
import { Toaster } from "react-hot-toast";

import Header from "./Components/Header";
import Login from "./Components/Login";
import Register from "./Components/Registration";
import Profile from "./Components/Profile";

import AdminDashbord from "./Components/AdminDashbord";
import AddCollege from "./Components/adminAddCollege";
import AddAds from "./Components/AddAds";
import AddProduct from "./Components/AdminAddProduct";
import RegisterUser from "./Components/Registeruser";
import Visiters from "./Components/Visitor";
import AddCity from "./Components/Addcity";
import AddField from "./Components/Addfield";

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
import ProductDetails from "./Components/ShoppingDetails";
import UsedItemDetails from "./Components/UsedItemDetails";

function App() {
  return (
    <>
      <Toaster position="top-center" />
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
          <Route path="mycartproduct" element={<Mycardproduct />} />
          <Route path="myorder" element={<Myorder />} />
          <Route path="entertainment" element={<Entertainment />} />
          <Route path="Accommodation" element={<Accomodation />} />
          <Route path="learning" element={<Learning />} />
          <Route path="learning-details" element={<LearningDetails />} />
          <Route path="shopping-details" element={<ProductDetails />} />
          <Route path="shop" element={<ShopItem />} />
          <Route path="useditem" element={<UsedItem />} />
          <Route path="useditemdetails" element={<UsedItemDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admindashboard/*" element={<AdminDashbord />}>
          <Route index element={<RegisterUser />} />
          <Route path="registeruser" element={<RegisterUser />} />
          <Route path="visitor" element={<Visiters />} />
          <Route path="addcity" element={<AddCity />} />
          <Route path="addfield" element={<AddField />} />
          <Route path="addcollege" element={<AddCollege />} />
          <Route path="addads" element={<AddAds />} />
          <Route path="addproduct" element={<AddProduct />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
