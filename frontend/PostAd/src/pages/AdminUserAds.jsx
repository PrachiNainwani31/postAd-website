import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AdminUserAds() {
  const { id } = useParams();
  const [ads, setAds] = useState([]);
const [userName, setUserName] = useState("");

useEffect(() => {
  axios.get(`http://localhost:5001/api/admin/users/${id}/ads`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(res => {
      setAds(res.data.ads || []);
      setUserName(res.data.userName || "User");
    })
    .catch(err => console.error("Failed to load ads:", err));
}, [id]);


  const updateStatus = (adId, status) => {
    axios.put(`http://localhost:5001/api/admin/ads/${adId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      setAds(prev => prev.map(a => a._id === adId ? res.data : a));
    }).catch(err => console.error("Status update failed:", err));
  };

  const deleteAd = (adId) => {
    axios.delete(`http://localhost:5001/api/ads/${adId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(() => {
      setAds(prev => prev.filter(a => a._id !== adId));
    }).catch(err => console.error("Delete failed:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ads of {userName}</h2>

      {ads.length === 0 ? (
        <p>No ads found for this user.</p>
      ) : (
        <div className="ads-grid">
          {ads.map(ad => (
            <div key={ad._id} className="ad-card">
              <img
                src={`http://localhost:5001/${ad.images?.[0]}`}
                alt={ad.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div className="ad-card-content">
                <h3>{ad.title}</h3>
                <p><strong>₹{ad.price}</strong></p>
                <p>{ad.description}</p>
                <p>{new Date(ad.createdAt).toDateString()}</p>
                <div style={{ marginTop: '10px' }}>
                  <select value={ad.status} onChange={e => updateStatus(ad._id, e.target.value)}>
                    {['pending', 'approved', 'rejected'].map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button style={{ marginLeft: '10px' }} onClick={() => deleteAd(ad._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUserAds;
