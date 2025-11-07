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

  // 🟢 Open modal for specific item
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
      // 🟢 Only send selected product
      const response = await fetch("http://localhost:5000/shopping/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: user.name,
          mobile: user.mobile_number,
          address: orderData.address,
          products: [selectedItem], // ✅ Only selected product
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${data.message}\nTotal: ₹${data.total_price}`);

        // 🟢 Remove only the ordered item from UI
        setCartItems(cartItems.filter((item) => item.id !== selectedItem.id));

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

      <div className="cart-cards">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-card">
              <img
                src={`http://localhost:5000/uploads/shopping_posts/${item.image_url}`}
                alt={item.name}
                className="cart-image"
              />
              <div className="cart-details">
                <h2>{item.name}</h2>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="buy-btn"
                  onClick={() => handlePlaceOrderClick(item)}
                >
                  Place Order
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No items in cart.</p>
        )}
      </div>

      {/* ✅ Modal */}
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
                <input type="text" value={selectedItem.name} readOnly />
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
