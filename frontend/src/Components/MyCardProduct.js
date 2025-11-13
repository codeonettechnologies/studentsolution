import React, { useEffect, useState } from "react";

export default function Mycardproduct() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({ address: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || !loggedInUser.id) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    setUser(loggedInUser);

    // Fetch cart items dynamically
    fetch(`http://localhost:5000/shopping/cart/${loggedInUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) setCartItems(data.data);
      })
      .catch((err) => console.error("Error fetching cart:", err))
      .finally(() => setLoading(false));
  }, []);

  // Open modal for specific item
  const handlePlaceOrderClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!orderData.address.trim()) {
      alert("Please enter your address.");
      return;
    }

    if (!user.mobile_number) {
      alert("Mobile number missing in user data!");
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
          products: [selectedItem],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${data.message}\nTotal: ₹${data.total_price}`);

        // Remove only the ordered item from UI
        setCartItems((prev) =>
          prev.filter((item) => item.product_id !== selectedItem.product_id)
        );

        setShowModal(false);
        setOrderData({ address: "" });
        setSelectedItem(null);
      } else {
        alert(`Error: ${data.message || "Order failed."}`);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong while placing your order.");
    }
  };

  if (loading) return <p>Loading cart items...</p>;

  return (
    <div className="cart-container">
      <h1>My Products</h1>

      {cartItems.length > 0 ? (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
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
                <td>{item.name}</td>
                <td>₹{item.product_price}</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    className="buy-btn"
                    onClick={() => handlePlaceOrderClick(item)}
                  >
                    Place Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-cart">No items in cart.</p>
      )}

      {/* Modal (same functionality) */}
      {showModal && selectedItem && (
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
                <input type="text" value={user.mobile_number || ""} readOnly />
              </label>
              <label>
                Product:
                <input type="text" value={selectedItem.name} />
              </label>
              <label>
                Quantity:
                <input type="number" value={selectedItem.quantity} readOnly />
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
