import React from 'react';
import '../styles/AdCard.css';

const AdCard = ({ ad }) => {
  return (
    <div className="ad-card">
       <img src={`http://localhost:5000/${ad.images[0]}`} alt={ad.title} />
      <h3>{ad.title}</h3>
      <p>{ad.price} Rs</p>
      <p>{ad.location}</p>
      <p>{ad.category}</p>
    </div>
  );
};

export default AdCard;
