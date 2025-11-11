const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/others";

    if (req.baseUrl.includes("/job")) {
      folder = "uploads/job_posts";
    } else if (req.baseUrl.includes("/coaching")) {
      folder = "uploads/coaching_posts";
    } else if (req.baseUrl.includes("/general")) {
      folder = "uploads/general_posts";
    } else if (req.baseUrl.includes("/tiffin")) {
      folder = "uploads/tiffin_posts";
    } else if (req.baseUrl.includes("/accommodation")) {
      folder = "uploads/accommodation_posts";
    } else if (req.baseUrl.includes("/entertainment")) {
      folder = "uploads/entertainment_posts";
    } else if (req.baseUrl.includes("/shopping")) {
      folder = "uploads/shopping_posts";
    } else if (req.baseUrl.includes("/usedItem")) {
      folder = "uploads/usedItem_posts";
    } else if (req.baseUrl.includes("/notes")) {
      folder = "uploads/notes_post";
    } else if (req.baseUrl.includes("/admin")) {
      folder = "uploads/ads"; // ✅ New folder for ads (image/video)
    }

    // Support via body.section if baseUrl not matched
    else if (req.body.section === "job") {
      folder = "uploads/job_posts";
    } else if (req.body.section === "coaching") {
      folder = "uploads/coaching_posts";
    } else if (req.body.section === "tiffin") {
      folder = "uploads/tiffin_posts";
    } else if (req.body.section === "general") {
      folder = "uploads/general_posts";
    } else if (req.body.section === "accommodation") {
      folder = "uploads/accommodation_posts";
    } else if (req.body.section === "entertainment") {
      folder = "uploads/entertainment_posts";
    } else if (req.body.section === "shopping") {
      folder = "uploads/shopping_posts";
    } else if (req.body.section === "usedItem") {
      folder = "uploads/usedItem_posts";
    } else if (req.body.section === "notes") {
      folder = "uploads/notes_post";
    } else if (req.body.section === "admin") {
      folder = "uploads/ads"; 
    }

  
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/", "video/", "application/pdf"];
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image, video, or PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

module.exports = upload;



// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder = "uploads/others";

//     if (req.baseUrl.includes("/job")) {
//       folder = "uploads/job_posts";
//     } else if (req.baseUrl.includes("/coaching")) {
//       folder = "uploads/coaching_posts";
//     } else if (req.baseUrl.includes("/general")) {
//       folder = "uploads/general_posts";
//     } else if (req.baseUrl.includes("/tiffin")) {
//       folder = "uploads/tiffin_posts";
//     } else if (req.baseUrl.includes("/accommodation")) {
//       folder = "uploads/accommodation_posts";
//     } else if (req.baseUrl.includes("/entertainment")) {
//       folder = "uploads/entertainment_posts";

//     } else if (req.baseUrl.includes("/shopping")) {
//       folder = "uploads/shopping_posts";

//     }   else if (req.baseUrl.includes("/shopping")) {
//       folder = "uploads/shopping_posts";
//     } else if (req.baseUrl.includes("/usedItem")) {
//       folder = "uploads/usedItem_posts";

//     } else if (req.baseUrl.includes("/notes")) {
//       folder = "uploads/notes_post";
//     }

//     // Support via body.section if baseUrl not matched

//     else if (req.body.section === "job") {
//       folder = "uploads/job_posts";
//     } else if (req.body.section === "coaching") {
//       folder = "uploads/coaching_posts";
//     } else if (req.body.section === "tiffin") {
//       folder = "uploads/tiffin_posts";
//     } else if (req.body.section === "general") {
//       folder = "uploads/general_posts";
//     } else if (req.body.section === "accommodation") {
//       folder = "uploads/accommodation_posts";
//     } else if (req.body.section === "entertainment") {
//       folder = "uploads/entertainment_posts";
//     }else if (req.body.section === "shopping") {
//       folder = "uploads/shopping_posts";
//     }else if (req.body.section === "usedItem") {
//       folder = "uploads/usedItem_posts";
//     } else if (req.body.section === "notes") {
//       folder = "uploads/notes_post";
//     }


//     if (!fs.existsSync(folder)) {
//       fs.mkdirSync(folder, { recursive: true });
//     }

//     cb(null, folder);
//   },

//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image or PDF files are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// module.exports = upload;

