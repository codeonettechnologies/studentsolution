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
//shopping
const shopingRoutes = require("./Shopping/routes/shopingRoutes");
<<<<<<< Updated upstream

// const tifnRoutes = require("./tifin/routes/tifinRoute")
=======
>>>>>>> Stashed changes
// Accomodation Route 
const accomodationRoutes = require("./accommodation/routes/accommodationRoute");
//entertainment
const entertainmentRoute = require("./entertainment/routes/entertainmentRoutes")
//usedItem
const usedItemRoute = require("./usedItem/routes/usedItemRoutes")


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

<<<<<<< Updated upstream
=======
//tiffin
>>>>>>> Stashed changes
app.use("/tiffin", tifnRoutes);

//entertainment 
app.use("/entertainment", entertainmentRoutes);

//shopping
app.use("/shopping", shopingRoutes);

//usedItem
app.use("/usedItem", usedItemRoute);

//accommodation
app.use("/accommodation" , accomodationRoutes)

//entertainment
app.use("/entertainment" , entertainmentRoute)
<<<<<<< Updated upstream
app.use("/general" , generalRoute)

=======
>>>>>>> Stashed changes


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
