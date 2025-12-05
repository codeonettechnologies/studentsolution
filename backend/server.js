const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/database");
const authRoutes = require("./authController/authRoutes");
const jobPostRoutes = require("./job/routes/jobRoute");
const coachingRoutes = require("./coaching/routes/coachingRoutes");
const tifnRoutes = require("./tifin/routes/tifinRoute");
const accomodationRoutes = require("./accommodation/routes/accommodationRoute");
const entertainmentRoute = require("./entertainment/routes/entertainmentRoutes")
const usedItemRoute = require("./usedItem/routes/usedItemRoutes")
const shopingRoutes = require("./Shopping/routes/shopingRoutes");
const generalRoute = require("./general/routes/generalRoute")
const noteRoute = require("./notes/routes/noteRoutes")
const adminRoute = require("./admin/routes/adminRoutes")

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
app.use("/api/auth", authRoutes);
app.use("/coaching", coachingRoutes);
app.use("/job", jobPostRoutes);
app.use("/tiffin", tifnRoutes);
app.use("/shopping", shopingRoutes);
app.use("/usedItem", usedItemRoute);
app.use("/accommodation" , accomodationRoutes)
app.use("/entertainment" , entertainmentRoute)
app.use("/general" , generalRoute)
app.use("/notes" , noteRoute)
app.use("/admin" , adminRoute)


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
