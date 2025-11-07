import React, { useState, useEffect } from "react";

export default function ShopItem() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = () => {
    setLoading(true);
    fetch("http://localhost:5000/shopping/products")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching all products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  // Function to fetch search results
  const fetchProducts = (query) => {
    if (!query.trim()) {
      fetchAllProducts(); 
      return;
    }

    setLoading(true);
    const url = `http://localhost:5000/shopping/search?query=${encodeURIComponent(query)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.data || data.results)) {
          setProducts(data.data || data.results);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  // Handle typing in search box
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchProducts(value);
  };

  // Add to cart function
  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please login first!");
      return;
    }

    const user_id = user.id;
    const quantity = 1;

    fetch("http://localhost:5000/shopping/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        product_id: product.id,
        quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Product added to cart!");
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, price, or description..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="shop-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="shop-card">
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
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="no-data">No products found.</p>
        )}
      </div>
    </>
  );
}
