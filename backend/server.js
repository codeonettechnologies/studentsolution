const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/database");
// auth route
const authRoutes = require("./authController/authRoutes");
//   job route
const jobPostRoutes = require("./job/routes/jobRoute");
// coaching route
const coachingRoutes = require("./coaching/routes/coachingRoutes");
// tifin route 
const tifnRoutes = require("./tifin/routes/tifinRoute");
//Entertainment route
const entertainmentRoutes = require("./entertainment/routes/entertainmentRoutes");

const shopingRoutes = require("./Shopping/routes/shopingRoutes");

const tifnRoutes = require("./tifin/routes/tifinRoute")
// Accomodation Route 
const accomodationRoutes = require("./accommodation/routes/accommodationRoute");

const entertainmentRoute = require("./entertainment/routes/entertainmentRoutes")

const generalRoute = require("./general/routes/generalRoute")

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// auth
app.use("/api/auth", authRoutes);
//coaching
app.use("/coaching", coachingRoutes);

// job
app.use("/job", jobPostRoutes);
app.use("/tiffin", tifnRoutes);

//entertainment 
app.use("/entertainment", entertainmentRoutes);

app.use("/shopping", shopingRoutes);

app.use("/accommodation" , accomodationRoutes)
app.use("/entertainment" , entertainmentRoute)
app.use("/general" , generalRoute)



app.use((req, res, next) => {
  req.db = connectDB;
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running successfully ");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
