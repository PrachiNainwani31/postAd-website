import React, { useState, useContext } from 'react';
import '../styles/PostAdPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostAdPage = () => {
  const { user } = useContext(AuthContext);
const storedUser = JSON.parse(localStorage.getItem("user"));
const fullUser = user?._id ? user : storedUser;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    images: [],
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullUser || !fullUser._id) {
  alert("Please login to post an ad.");
  return;
}

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('user', fullUser._id); // ✅ this must not be undefined

    for (let file of formData.images) {
      data.append('images', file);
    }

    console.log("Preparing FormData...");
for (let pair of data.entries()) {
  console.log(pair[0] + ':', pair[1]);
}

    try {
      console.log("🧪 Submitting Ad Form");
console.log("Form fields:", formData);
console.log("User ID being sent:", fullUser?._id);
console.log("Images being sent:", formData.images);
      const res = await axios.post("http://localhost:5001/api/ads/post", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate("/");
      } else {
        alert("Failed to post ad");
      }
    } catch (err) {
      console.error("POST error:", err);
      const msg = err?.response?.data?.details || "Something went wrong.";
      alert(msg);
    }
  };

  
  return (
    <div className="postad-container">
      <h2>Post Your Ad</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ad Title"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Services">Services</option>
          <option value="Business Promotion">Business Promotion</option>
          <option value="Sales">Sales</option>
          <option value="Jobs">Jobs</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PostAdPage;
