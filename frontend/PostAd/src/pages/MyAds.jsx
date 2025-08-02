import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api'; 
import { AuthContext } from '../context/AuthContext';
import EditAdModal from '../components/EditAdModal';
import Footer from '../components/Footer';
import '../styles/MyAds.css';

const MyAds = () => {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);

  useEffect(() => {
    if (user?._id) {
      API.get(`/ads/user/${user._id}`)
        .then(res => setAds(res.data))
        .catch(err => console.error("Error fetching user ads:", err));
    }
  }, [user]);

  const handleDelete = async (adId) => {
    try {
      await API.delete(`/ads/${adId}`);
      setAds(prev => prev.filter(ad => ad._id !== adId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (!user) {
    return <div className="not-logged-in">Please log in to view your ads.</div>;
  }

  return (
    <>
      <div className="myads-container">
        <h2>My Ads</h2>
        {ads.length === 0 ? (
          <p className="no-ads">No ads found.</p>
        ) : (
          <div className="ads-list">
            {ads.map(ad => (
              <div key={ad._id} className="ad-row">
                <div className="ad-card">
                  {/* CHANGED: Use the Cloudinary URL directly */}
                  {ad.images && ad.images.length > 0 && (
                    <img src={ad.images[0]} alt={ad.title} />
                  )}
                  <div className="ad-content">
                    <h3>{ad.title}</h3>
                    <p><strong>₹ {ad.price}</strong></p>
                    <p>{ad.description}</p>
                    <p>{ad.location}</p>
                    <p className="date">{new Date(ad.createdAt).toDateString()}</p>
                  </div>
                </div>
                <div className="ad-actions">
                  <button className="btn edit" onClick={() => setEditingAd(ad)}>Edit</button>
                  <button className="btn delete" onClick={() => handleDelete(ad._id)}>Delete</button>
                  <button className="btn status">{ad.status || "Status: pending"}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingAd && (
        <EditAdModal
          ad={editingAd}
          onSave={(updatedAd) => {
            setAds(prev => prev.map(a => a._id === updatedAd._id ? updatedAd : a));
            setEditingAd(null);
          }}
          onCancel={() => setEditingAd(null)}
        />
      )}

      <Footer />
    </>
  );
};

export default MyAds;