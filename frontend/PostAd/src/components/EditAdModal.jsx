import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EditAdModal.css';

const categories = ["Services", "Business Promotion", "Sales", "Jobs"];

function EditAdModal({ ad, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: ad.title || '',
    description: ad.description || '',
    price: ad.price || '',
    location: ad.location || '',
    category: ad.category || '',
  });

  const [existingImages, setExistingImages] = useState(ad.images || []);
  const [newImages, setNewImages] = useState([]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append basic fields
    for (const key in form) {
      formData.append(key, form[key]);
    }

    // Keep only the selected existing images
    existingImages.forEach(img => formData.append('keepImages', img));

    // Add new files
    newImages.forEach(file => formData.append('images', file));

    try {
      const res = await axios.put(`http://localhost:5001/api/ads/${ad._id}`, formData);
      onSave(res.data.ad);
    } catch (err) {
      console.error('Update failed:', err);
      alert("Failed to update ad.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="edit-ad-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <h2>Edit Ad</h2>

          <label htmlFor="title">Title:</label>
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="price">Price (₹):</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="location">Location:</label>
          <input
            name="location"
            value={form.location}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="category">Category:</label>
          <select name="category" value={form.category} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label>Existing Images:</label>
          <div className="existing-images-preview">
            {existingImages.map((img, index) => (
              <div key={index} className="image-thumb">
                <img src={`http://localhost:5001/${img}`} alt="ad preview" />
                <button type="button" onClick={() => handleRemoveExistingImage(index)}>✖</button>
              </div>
            ))}
          </div>

          <label>Add New Images:</label>
          <input type="file" multiple onChange={handleNewImageChange} accept="image/*" />

          <div className="form-buttons">
            <button type="submit" className="btn save">Save Changes</button>
            <button type="button" className="btn cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAdModal;
