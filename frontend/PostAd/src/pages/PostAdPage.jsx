import React, { useState, useContext, useEffect } from 'react';
import '../styles/PostAdPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostAdPage = () => {
  const { user } = useContext(AuthContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const fullUser = user?._id ? user : storedUser;
  const navigate = useNavigate();

  const badWords = ['fuck', 'shit', 'bitch', 'damn'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    images: [],
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = formData.description.trim().split(/\s+/);
    setWordCount(formData.description.trim() === "" ? 0 : words.length);
  }, [formData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullUser || !fullUser._id) {
      setError("Please login to post an ad.");
      return;
    }

    const words = formData.description.trim().split(/\s+/);
    if (words.length < 10) {
      setError("Description must be at least 0 words.");
      return;
    }

    const hasBad = badWords.some(bad =>
      formData.description.toLowerCase().includes(bad)
    );
    if (hasBad) {
      setError("Description contains inappropriate language.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let file of value) {
          data.append("images", file);
        }
      } else {
        data.append(key, value);
      }
    });
    data.append("user", fullUser._id);

    try {
      const res = await axios.post("http://localhost:5001/api/ads/post", data);
      if (res.data.success) {
        navigate("/");
      } else {
        setError("Failed to post ad.");
      }
    } catch (err) {
      console.error("POST error:", err);
      const msg = err?.response?.data?.details || "Something went wrong.";
      setError(msg);
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

        <label htmlFor="description">
          Description <small style={{ color: '#777' }}>(Minimum 10 words, no bad language)</small>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={6}
        />
        <small style={{ color: wordCount < 10 ? 'red' : 'green' }}>
          Word Count: {wordCount}
        </small>

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
  name="images"
  multiple
  accept="image/*"
  onChange={handleFileChange}
/>


        <button type="submit">Submit</button>
        {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PostAdPage;
