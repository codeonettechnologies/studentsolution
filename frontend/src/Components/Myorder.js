import React, { useEffect, useState } from "react";

export default function Myorder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user details from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    // Fetch orders for the logged-in user
    fetch(`http://localhost:5000/shopping/order/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.orders) {
          setOrders(data.orders);
        } else {
          console.log("No orders found");
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{order.total_price}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Payment Mode:</strong> {order.payment_mode}
              </p>
              <p>
                <strong>Mobile:</strong> {order.user_mobile}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
