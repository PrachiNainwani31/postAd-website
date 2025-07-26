import React, { useEffect, useState } from "react";
import API from "../api/api"; // ✅ CHANGED: Import your central API instance
// import axios from "axios"; // 🛑 REMOVED: No longer need direct axios

export default function AdminAllAds() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    // ✅ CHANGED: Use the API instance
    API.get("/admin/ads", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const sorted = res.data.sort((a, b) => {
          const order = { pending: 0, approved: 1, rejected: 2 };
          return order[a.status] - order[b.status];
        });
        setAds(sorted);
      })
      .catch(console.error);
  }, []);

  const updateStatus = (id, newStatus) =>
    // ✅ CHANGED: Use the API instance
    API.put(
      `/admin/ads/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).then((res) =>
      setAds((prev) => prev.map((ad) => (ad._id === id ? res.data : ad)))
    );

  const deleteAd = (id) =>
    // ✅ CHANGED: Use the API instance
    API.delete(`/ads/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => setAds((prev) => prev.filter((ad) => ad._id !== id)));

  return (
    <div className="myads-container">
      <h2>All Ads</h2>
      {ads.length === 0 ? (
        <p>No ads available</p>
      ) : (
        <div className="ads-list">
          {ads.map((ad) => (
            <div key={ad._id} className="ad-row">
              <div className="ad-card">
                {/* ✅ CHANGED: Use the image URL directly and add a check */}
                {ad.images && ad.images.length > 0 && (
                  <img src={ad.images[0]} alt={ad.title} />
                )}
                <div className="ad-content">
                  <h3>{ad.title}</h3>
                  <p>
                    <strong>₹ {ad.price}</strong>
                  </p>
                  <p>{ad.description}</p>
                  <p>{ad.location}</p>
                  <p className="date">
                    {new Date(ad.createdAt).toDateString()}
                  </p>
                </div>
              </div>
              <div className="ad-actions">
                <select
                  value={ad.status}
                  onChange={(e) => updateStatus(ad._id, e.target.value)}
                >
                  {["pending", "approved", "rejected"].map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button className="btn delete" onClick={() => deleteAd(ad._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}