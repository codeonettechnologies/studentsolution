import React, { useState, useRef, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import toast from "react-hot-toast";
import { FaEllipsisV } from "react-icons/fa";

export default function AddProduct() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropped, setIsCropped] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const cropperRef = useRef(null);

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/shopping/products");
      const data = await res.json();
      setProducts(data?.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Handle file select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setIsCropped(false);
      setCroppedImage(null);
    }
  };

  // Crop image
  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      const file = new File([blob], "cropped_image.png", { type: "image/png" });
      setCroppedImage(file);
      setIsCropped(true);
    });
  };

  // Add product API
  const handleAdd = async () => {
    if (!name || !description || !price || !croppedImage) {
      toast("Please fill all fields and crop an image!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", croppedImage);

      const res = await fetch("http://localhost:5000/shopping/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Product added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setImage(null);
        setCroppedImage(null);
        setIsCropped(false);
        setShowForm(false);
        fetchProducts();
      } else {
        toast.error("Error: " + (data.message || "Failed to add product"));
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/shopping/products/delete/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Product deleted!");
        setProducts(products.filter((p) => p.id !== id));
      } else {
        toast.error("Error deleting product!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="admin-container">
      <button className="open-form-btn" onClick={() => setShowForm(true)}>
        + Add Product
      </button>

      {/* Popup Modal */}
      {showForm && (
        <div className="add-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ×
            </button>
            <h2>Add Product</h2>

            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {image && !isCropped && (
              <div className="crop-area">
                <Cropper
                  src={image}
                  style={{ height: 300, width: "100%" }}
                  aspectRatio={1}
                  guides={true}
                  ref={cropperRef}
                />
                <button className="crop-btn" onClick={handleCrop}>
                  Crop Image
                </button>
              </div>
            )}

            {croppedImage && isCropped && (
              <div className="preview-area">
                <h4>Preview:</h4>
                <img
                  src={URL.createObjectURL(croppedImage)}
                  alt="Cropped Preview"
                  style={{ width: "150px", borderRadius: "10px" }}
                />
              </div>
            )}

            <button className="add-btn" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      )}

      {/* Products Table / Mobile Cards */}
      <div className="table-container">
        <h3>All Products</h3>

        {products.length > 0 ? (
          <>
            {/* Desktop Table */}
            <table className="desktop-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/uploads/shopping_posts/${p.image_url}`}
                        alt={p.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.description || "N/A"}</td>
                    <td>₹{p.price}</td>
                    <td className="action-cell">
                      <div className="menu-container">
                        <FaEllipsisV
                          className="menu-icon"
                          onClick={() =>
                            setMenuOpen(menuOpen === p.id ? null : p.id)
                          }
                        />
                        {menuOpen === p.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleDelete(p.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View Cards */}
            <div className="mobile-products">
              {products.map((p) => (
                <div className="product-card" key={p.id}>
                  <img
                    src={`http://localhost:5000/uploads/shopping_posts/${p.image_url}`}
                    alt={p.name}
                  />
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p>{p.description || "N/A"}</p>
                    <span>₹{p.price}</span>
                  </div>
                  <div className="menu-container">
                    <FaEllipsisV
                      className="menu-icon"
                      onClick={() =>
                        setMenuOpen(menuOpen === p.id ? null : p.id)
                      }
                    />
                    {menuOpen === p.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleDelete(p.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
