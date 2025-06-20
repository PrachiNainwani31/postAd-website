import React from 'react';
import '../styles/AdCard.css';

const AdCard = ({ ad }) => {
  return (
    <div className="ad-card">
      <img src={ad.image} alt={ad.title} />
      <h3>{ad.title}</h3>
      <p>{ad.price} Rs</p>
      <p>{ad.location}</p>
    </div>
  );
};

export default AdCard;
