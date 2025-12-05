import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ShopItem() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch all products initially
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = () => {
    setLoading(true);
    fetch("http://localhost:5000/shopping/products")
      .then((res) => res.json())
      .then((data) => setProducts(data?.data || []))
      .catch((err) => {
        console.error("Error fetching all products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  //Featch search Result
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim() || search.trim().length < 3) {
        fetchAllProducts();
      } else {
        fetchProducts(search);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = (query) => {
    setLoading(true);
    fetch(
      `http://localhost:5000/shopping/search?query=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data?.data || data?.results || []))
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      toast("Please login first!");
      return;
    }

    fetch("http://localhost:5000/shopping/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => toast.success(data.message || "Product added to cart!"))
      .catch((err) => {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add product to cart.");
      });
  };

  const handleProductClick = (product) => {
    navigate("/dashboard/shopping-details", { state: { product } });
  };

  return (
    <div className="main-content-area">
      <div className="shop-top-bar">
        <input
          type="text"
          placeholder="Search by name, price, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shop-search-input"
        />
        <button
          className="mycart-btn"
          onClick={() => navigate("/dashboard/mycartproduct")}
        >
          🛒 My Cart
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {/* Products */}
      <div className="shop-container">
        {products.length > 0
          ? products.map((product) => (
              <div
                key={product.id}
                className="shop-card"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <div className="shop-image">
                  <img
                    src={`http://localhost:5000/uploads/shopping_posts/${product.image_url}`}
                    alt={product.name}
                  />
                </div>
                <div className="shop-details">
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-description">
                    {product.description || "No description available."}
                  </p>
                  <p className="product-price">₹{product.price}</p>
                  <button
                    className="buy-btn"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          : !loading && <p className="no-data">No products found.</p>}
      </div>
    </div>
  );
}
