import React, { useState } from 'react';
import '../styles/PostAdPage.css';
import { useNavigate } from 'react-router-dom';


const PostAdPage = () => {
    
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
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      return setMessage("You must be logged in to post an ad.");
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('userId', user._id);

    for (let file of formData.images) {
      data.append('images', file);
    }

    try {
      const res = await fetch('http://localhost:5000/api/ads/post', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
  setMessage("Ad posted successfully!");
  setTimeout(() => {
    navigate('/');
  }, 1000);
} else {
  setMessage("Something went wrong.");
}

    } catch (err) {
      setMessage("Failed to post ad.");
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
