const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");

const {
  addProduct,
  getAllProducts,
  addToCart,
  getUserCart,
  placeOrder,
  cancelOrder,
  searchProducts
} = require("../controllers/shoppingControllers");

// Product routes
router.post("/products", upload.single("image"), addProduct);
router.get("/products", getAllProducts);

//Search routes 
router.get("/search", searchProducts);

// Cart routes
router.post("/cart", addToCart);
router.get("/cart/:user_id", getUserCart);

// Order route
router.post("/order", placeOrder);

//Cancel order
router.put("/order/cancel/:order_id", cancelOrder);


module.exports = router;
