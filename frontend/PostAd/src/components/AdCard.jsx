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
      <h3>{ad.title}</h3>
      <p>{ad.price} Rs</p>
      <p>{ad.location}</p>
      <p>{ad.category}</p>
    </div>
  );
};

export default AdCard;
