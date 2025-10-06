import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Components/Websitedesign.css";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Register from "./Components/Registration";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
