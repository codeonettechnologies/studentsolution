import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Mycardproduct() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({ address: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || !loggedInUser.id) {
      setLoading(false);
      return;
    }

    setUser(loggedInUser);

    fetch(`http://localhost:5000/shopping/cart/${loggedInUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) setCartItems(data.data);
      })
      .catch((err) => console.error("Error fetching cart:", err))
      .finally(() => setLoading(false));
  }, []);

  // Open modal
  const openOrderModal = () => {
    if (cartItems.length === 0) {
      toast("Cart is empty!");
      return;
    }
    setShowModal(true);
  };

  // Remove a single item
  const removeItem = (product_id) => {
    setCartItems((prev) => prev.filter((i) => i.product_id !== product_id));
    toast("Item removed!");
  };

  const handleInputChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!orderData.address.trim()) {
      toast("Please enter your address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/shopping/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: user.name,
          mobile: user.mobile_number,
          address: orderData.address,
          products: cartItems, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast(`${data.message}\nTotal: ₹${data.total_price}`);

        // Clear the cart from UI
        setCartItems([]);

        setShowModal(false);
        setOrderData({ address: "" });
      } else {
        toast.error(data.message || "Order failed.");
      }
    } catch (err) {
      toast("Error placing order.");
    }
  };

  if (loading) return <p>Loading cart items...</p>;

  return (
    <div className="cart-container">
      <h1>My Products</h1>

      {/* ONE PLACE ORDER BUTTON AT TOP */}
      {cartItems.length > 0 && (
        <button className="buy-btn" onClick={openOrderModal}>
          Place Order
        </button>
      )}

      {cartItems.length > 0 ? (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th> 
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/shopping_posts/${item.product_image}`}
                    alt={item.name}
                    className="cart-image"
                  />
                </td>
                <td>₹{item.product_price}</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product_id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-cart">No items in cart.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <h2>Place Your Order</h2>
            <form onSubmit={handleSubmitOrder}>
              <label>
                Name:
                <input type="text" value={user.name} readOnly />
              </label>
              <label>
                Mobile:
                <input type="text" value={user.mobile_number} readOnly />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  required
                />
              </label>

              <label className="cod-box">
                <input type="checkbox" checked readOnly />
                COD Only
              </label>

              <div style={{ marginTop: "15px" }}>
                <button type="submit" className="buy-btn">
                  Submit Order
                </button>
                <button
                  type="button"
                  className="buy-btn"
                  style={{ marginLeft: "10px", background: "#dc3545" }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
