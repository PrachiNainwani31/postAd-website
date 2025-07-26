import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Adcard.css';

const AdCard = ({ ad }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads/${ad._id}`);
  };

  return (
    <div className="ad-card" onClick={handleClick}>
      {/*  CHANGED: Use the full URL from ad.images[0] directly */}
      {/* Also added a check to prevent errors if an ad has no images */}
      {ad.images && ad.images.length > 0 && (
        <img src={ad.images[0]} alt={ad.title} />
      )}
      <div className="ad-card-content">
        <p className="price">₹ {ad.price}</p>
        <h3>{ad.title}</h3>
        <p className="location">{ad.location}</p>
        <p className="date">{new Date(ad.createdAt).toDateString()}</p>
      </div>
    </div>
  );
};

export default AdCard;