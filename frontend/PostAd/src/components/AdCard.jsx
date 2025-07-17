import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdCard.css';

const AdCard = ({ ad }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads/${ad._id}`);
  };

  return (
    <div className="ad-card" onClick={handleClick}>
      <img src={`http://localhost:5001/${ad.images[0]}`} alt={ad.title} />
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
