const connectDB = require("../../config/database");
const db = connectDB();
const database = connectDB().promise(); // async/await use

//-------------------- ADD PRODUCT --------------------
exports.addProduct = (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Product name and price are required" });
    }

    const sql =
      "INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, description, price, image_url], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      res
        .status(201)
        .json({
          message: "Product added successfully",
          product_id: result.insertId,
        });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//-------------------- GET ALL PRODUCTS --------------------
exports.getAllProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    res.status(200).json({ message: "All products fetched", data: results });
  });
};



//-------------------- Delete PRODUCTS --------------------
exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
 
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
 
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err.message });
 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
 
      res.status(200).json({ message: "Product deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
 
 

//-------------------- ADD TO CART --------------------
exports.addToCart = (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    console.log("BODY:", req.body);
    console.log("HEADERS:", req.headers["content-type"]);

    if (!user_id || !product_id) {
      return res
        .status(400)
        .json({ message: "user_id and product_id are required" });
    }

    const sql =
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?";
    db.query(
      sql,
      [user_id, product_id, quantity || 1, quantity || 1],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Database error", error: err.message });
        res.status(200).json({ message: "Product added to cart" });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//-------------------- GET USER CART --------------------
exports.getUserCart = (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT c.id, p.name, p.price, p.image_url, c.quantity
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [user_id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    res.status(200).json({ message: "Cart fetched", data: results });
  });
};

//-------------------- PLACE ORDER (COD) --------------------
exports.placeOrder = async (req, res) => {
  try {
    const { user_id, address } = req.body;

    if (!user_id || !address) {
      return res
        .status(400)
        .json({ message: "user_id and address are required" });
    }

    // ✅ Get user mobile number
    const [userRows] = await database.query(
      "SELECT mobile_number FROM users WHERE id = ?",
      [user_id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userMobile = userRows[0].mobile_number;
    console.log("User Mobile:", userMobile);

    // ✅ Get cart items
    const [cartItems] = await database.query(
      "SELECT c.quantity, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?",
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total_price = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Insert order
    await database.query(
      "INSERT INTO orders (user_id, total_price, address, payment_mode, user_mobile, status) VALUES (?, ?, ?, 'COD', ?, 'Pending')",
      [user_id, total_price, address, userMobile]
    );

    // ✅ Clear cart
    await database.query("DELETE FROM cart WHERE user_id = ?", [user_id]);

    res.status(201).json({
      message: "Order placed successfully (COD)",
      total_price,
      user_mobile: userMobile,
    });
  } catch (error) {
    console.error("Order error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


// -------------------- GET MY ORDERS --------------------
exports.getMyOrders = async (req, res) => {
  try {
    const { user_id } = req.params;
 
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
 
    const [orders] = await database.query(
      "SELECT id, total_price, address, payment_mode, user_mobile, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
 
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
 
    res.status(200).json({
      message: "Orders fetched successfully",
      total_orders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//-------------------- SEARCH PRODUCTS --------------------
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const [results] = await database.query(
      `SELECT * FROM products 
       WHERE name LIKE ? OR description LIKE ? OR price LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ message: "Products found", data: results });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

//-------------------- CANCEL ORDER --------------------
exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { user_id } = req.body;

    if (!order_id || !user_id) {
      return res
        .status(400)
        .json({ message: "order_id and user_id are required" });
    }

    const [order] = await database.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [order_id, user_id]
    );

    if (order.length === 0) {
      return res
        .status(404)
        .json({ message: "Order not found or not belongs to user" });
    }

    if (order[0].status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    await database.query(
      `UPDATE orders SET status = 'Cancelled' WHERE id = ?`,
      [order_id]
    );

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};
