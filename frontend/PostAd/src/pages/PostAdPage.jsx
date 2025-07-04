import React, { useState } from 'react';
import '../styles/PostAdPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const PostAdPage = () => {
    const { user } = useContext(AuthContext);
const navigate=useNavigate();
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
  // const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please login to post an ad.");
    return;
  }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('user', user._id);

    for (let file of formData.images) {
      data.append('images', file);
    }

   try {
    const res = await axios.post("http://localhost:5001/api/ads/post", data);
    if (res.data.success) {
      navigate("/");
    } else {
      alert("Failed to post ad");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
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
          // accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PostAdPage;
