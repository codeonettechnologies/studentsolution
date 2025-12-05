import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/profile/${userId}`);
        const data = await res.json();

        if (data.success) setProfile(data.user);
      } catch (err) {
        console.log("Profile Error:", err);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [userId]);

  // Upload Profile Image Function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/profile-image/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);

      if (data.success) {
        toast.success("Profile Picture Updated!");

        setProfile((prev) => ({
          ...prev,
          profile_image: data.fileName,
        }));

        const updatedUser = { ...storedUser, profile_image: data.fileName };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error("Failed to update image!");
      }
    } catch (error) {
      console.log("Upload Error:", error);
      toast("Something went wrong!");
    }

    setUploading(false);
  };

  if (loading) return <h2 className="loading">Loading Profile...</h2>;
  if (!profile) return <h2 className="not-found">No Profile Found</h2>;

  return (
    <div className="profile-wrapper">

      <div className="profile-left">
        <div className="profile-image-container">
          <img
            src={`http://localhost:5000/uploads/${profile.profile_image}`}
            alt="profile"
            className="profile-circle"
          />

          <label className="edit-icon">
            <input type="file" hidden onChange={handleImageUpload} />
            ✏️
          </label>
        </div>

        {uploading && <p className="upload-text">Updating...</p>}
      </div>

      <div className="profile-right">
        <h2 className="profile-heading">{profile.name}</h2>

        <div className="profile-info-grid">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile_number}</p>
          <p><strong>College:</strong> {profile.college}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>Profession:</strong> {profile.profession}</p>
          <p><strong>Year:</strong> {profile.college_year}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      </div>
    </div>
  );
}
